const db = require('../config/db')
const escape = require('pg-format')
const model = {}

model.getData = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.schedules ORDER BY id_schedule DESC')
            .then((res) => {
                resolve(res.rows)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

model.getBy = async ({ page, limit, orderBy, search }) => {
    try {
        let filterQuery = ''
        let orderQuery = ''
        let metaQuery = ''
        let count = 0

        if (search) {
            filterQuery += escape('AND movie_title = %L', search)
        }

        if (orderBy) {
            orderQuery += escape('ORDER BY %s DESC ', orderBy)
        }

        if (page && limit) {
            const offset = (page - 1) * limit
            metaQuery += escape('LIMIT %s OFFSET %s', limit, offset)
        }

        db.query(`SELECT COUNT(id_schedule) as "count" FROM public.schedules WHERE true ${filterQuery}`).then((v) => {
            count = v.rows[0].count
        })

        const data = await db.query(`
            SELECT 
                s.id_schedule,
                json_agg(
                    JSONB_BUILD_OBJECT(
                        'id', ms.id_movie,
                        'value',  mv.movie_title
                    )
                ) as movie,
                s.price,
                s.premiere,
                s.place,
                s.date_start,
                s.date_end, 
                s.created_at,
                s.updated_at
            FROM public.schedules s
            JOIN public.movie_schedule ms ON ms.id_schedule = s.id_schedule
            JOIN public.movies mv ON ms.id_movie = mv.id_movie
            WHERE true ${filterQuery}
            GROUP BY s.id_schedule
            ${orderQuery} ${metaQuery}
        `)

        const meta = {
            next: count <= 0 ? null : page == Math.ceil(count / limit) ? null : Number(page) + 1,
            prev: page == 1 ? null : Number(page) - 1,
            total: count
        }

        if (data.rows <= 0) {
            return 'data not found'
        } else {
            return { data: data.rows, meta }
        }
    } catch (error) {
        throw error
    }
}

model.save = async ({ movie, price, premiere, place, date_start, date_end}) => {
    const pg = await db.connect();
    try {
        await pg.query('BEGIN');

        const schedule = await pg.query(
            `INSERT INTO public.schedules        
                (price, premiere, place, date_start, date_end)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_schedule`,
            [price, premiere, place, date_start, date_end]
        );

        if (movie && movie.length > 0) {
            movie.map(async (v) => {
                return await pg.query(
                    `
                    INSERT INTO public.movie_schedule
                        (id_schedule, id_movie)
                    VALUES ($1, $2)`,
                    [schedule.rows[0].id_schedule, v]
                );
            })
        }

        await pg.query('COMMIT');
        return `${schedule.rowCount} data schedule created`;
    } catch (error) {
        await pg.query('ROLLBACK');
        throw error;
    } finally {
        pg.release();
    }
};


model.update = async ({ price, premiere, place, date_start, date_end }, id) => {
    try {
        const pg = await db.connect()
        await pg.query('BEGIN')

        const movie = await pg.query(
            `UPDATE public.schedules SET
            price=$1, premiere=$2, place=$3, date_start=$4, date_end=$5
            WHERE id_schedule=$6`,
            [price, premiere, place, date_start, date_end, id]
        )

        if (movie.length > 0) {
            movie.map(async (v) => {
                return await pg
                    .query(
                        `
                        UPDATE public.movie_schedule SET
                        id_schedule = $1
                    WHERE movie_schedule = $2`,
                        [v.id, v.movie_schedule]
                    )
                    .catch((err) => {
                        console.log(err)
                    })
            })
        }

        await pg.query('COMMIT')
        return `${schedule.rowCount} data schedule updated`
    } catch (error) {
        await pg.query('ROLLBACK')
        throw error
    }
}

module.exports = model
