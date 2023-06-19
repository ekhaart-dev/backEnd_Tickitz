const db = require('../config/db')
const escape = require('pg-format')
const model = {}

model.getData = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM bookings ORDER BY id_booking DESC')
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

        db.query(`SELECT COUNT(id_booking) as "count" FROM public.bookings WHERE true ${filterQuery}`).then((v) => {
            count = v.rows[0].count
        })

        const data = await db.query(`
            SELECT 
                b.id_booking,
                json_agg(
                    JSONB_BUILD_OBJECT(
                        'id', mv.id_movie,
                        'value', mv.movie_title
                    )
                ) as movie,
                b.created_at, 
                b.updated_at
            FROM public.bookings b
            JOIN public.movies mv ON b.id_movie = mv.id_movie
            WHERE true ${filterQuery}
            GROUP BY b.id_booking
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

model.save = async ({ movie }) => {
    const pg = await db.connect();
    try {
        await pg.query('BEGIN');

        const booking = await pg.query(
            `INSERT INTO public.bookings
                (id_movie)
            VALUES ($1)
            RETURNING id_booking`,
            [movie]
        );

        await pg.query('COMMIT');
        return `${booking.rowCount} data booking created`;
    } catch (error) {
        await pg.query('ROLLBACK');
        throw error;
    } finally {
        pg.release();
    }      
};


model.update = async ({ movie }, id) => {
    try {
        const pg = await db.connect()
        await pg.query('BEGIN')

        const booking = await pg.query(
            `UPDATE public.bookings SET
            id_movie=$1
            WHERE id_booking=$2`,
            [movie, id]
        )

        await pg.query('COMMIT')
        return `${booking.rowCount} data booking updated`
    } catch (error) {
        await pg.query('ROLLBACK')
        throw error
    }
}

module.exports = model
