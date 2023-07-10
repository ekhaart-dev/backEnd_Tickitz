const db = require("../config/db");
const escape = require("pg-format");
const moment = require("moment");
const model = {};

model.getData = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM movies ORDER BY id_movie DESC")
      .then((res) => {
        resolve(res.rows);
      })
      .catch((er) => {
        reject(er);
      });
  });
};

model.getBy = async ({ page, limit, orderBy, search, genre }) => {
  try {
    let filterQuery = "";
    let orderQuery = "";
    let metaQuery = "";
    let count = 0;
    let genre = "";

    if (search || genre) {
      filterQuery += search ? escape("AND movie_title = %L", search) : "";
      filterQuery += genre
        ? escape("AND LOWER(g.genre_title) = LOWER(%L)", genre)
        : "";
    }

    if (orderBy) {
      orderQuery += escape("ORDER BY %s DESC ", orderBy);
    }

    if (page && limit) {
      const offset = (page - 1) * limit;
      metaQuery += escape("LIMIT %s OFFSET %s", limit, offset);
    }

    db.query(
      `SELECT COUNT(mv.movie_id) as "count" FROM public.movie mv JOIN public.movie_genre mg ON mg.movie_id = mv.movie_id JOIN public.genre g ON mg.genre_id = g.genre_id WHERE true ${filterQuery}`
    ).then((v) => {
      count = v.rows[0].count;
    });

    const data = await db.query(`
            SELECT 
                mv.id_movie,
                mv.movie_banner,
                mv.movie_title,
                mv.director,
                STRING_AGG(g.genre_title, ', ')as genres,
                mv.casts,
                mv.release_date,
                mv.duration,
                mv.synopsis,
                mv.created_at, 
                mv.updated_at
            FROM public.movies mv
            JOIN public.movie_genre mg ON mg.id_movie = mv.id_movie
            JOIN public.genres g ON mg.id_genre = g.id_genre
            WHERE true ${filterQuery}
            GROUP BY mv.id_movie
            ${orderQuery} ${metaQuery}
        `);

    const meta = {
      next:
        count <= 0
          ? null
          : page == Math.ceil(count / limit)
          ? null
          : Number(page) + 1,
      prev: page == 1 ? null : Number(page) - 1,
      total: count,
    };

    if (data.rows <= 0) {
      return "data not found";
    } else {
      data.rows.map((v) => {
        const date = moment(v.release_date);
        v.release_date = date.format("DD MMMM YYYY");
      });
      return { data: data.rows, meta };
    }
  } catch (error) {
    throw error;
  }
};

model.save = async ({
  banner,
  name,
  director,
  casts,
  release,
  duration,
  synopsis,
  genre,
}) => {
  const pg = await db.connect();
  try {
    await pg.query("BEGIN");

    const movie = await pg.query(
      `INSERT INTO public.movies
                (movie_banner, movie_title, director, casts, release_date, duration, synopsis)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id_movie`,
      [banner, name, director, casts, release, duration, synopsis]
    );

    if (genre && genre.length > 0) {
      genre.map(async (v) => {
        return await pg.query(
          `
                    INSERT INTO public.movie_genre
                        (id_movie, id_genre)
                    VALUES ($1, $2)`,
          [movie.rows[0].id_movie, v]
        );
      });
    }

    await pg.query("COMMIT");
    return `${movie.rowCount} data movie created`;
  } catch (error) {
    await pg.query("ROLLBACK");
    throw error;
  } finally {
    pg.release();
  }
};

model.update = async (
  { banner, name, director, genre, casts, release, duration, synopsis },
  id
) => {
  try {
    const pg = await db.connect();
    await pg.query("BEGIN");

    const movie = await pg.query(
      `UPDATE public.movies SET
            movie_banner=$1, movie_title=$2, director=$3, casts=$4, release_date=$5, duration=$6, synopsis=$7
            WHERE id_movieß=$8`,
      [banner, name, director, casts, release, duration, synopsis, id]
    );

    if (genre.length > 0) {
      genre.map(async (v) => {
        return await pg
          .query(
            `
                        UPDATE public.movie_genre SET
                        id_movie = $1
                    WHERE movie_genre = $2`,
            [v.id, v.movie_genre]
          )
          .catch((err) => {
            console.log(err);
          });
      });
    }

    await pg.query("COMMIT");
    return `${movie.rowCount} data movie updated`;
  } catch (error) {
    await pg.query("ROLLBACK");
    throw error;
  }
};

module.exports = model;
