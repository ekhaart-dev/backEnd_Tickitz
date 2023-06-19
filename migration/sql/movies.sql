CREATE TABLE public.movies (
    id_movie serial NOT NULL,
    movie_banner varchar NULL,
    movie_title varchar NOT NULL,
    director varchar NULL,
    casts varchar NULL,
    release_date TIMESTAMP WITHOUT TIME ZONE NULL,
    duration INTEGER NOT NULL,
    synopsis TEXT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    CONSTRAINT movie_pk PRIMARY KEY (id_movie)
);