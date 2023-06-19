CREATE TABLE public.genres (
    id_genre serial NOT NULL,
    genre_title VARCHAR NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    CONSTRAINT genre_pk PRIMARY KEY (id_genre)
);