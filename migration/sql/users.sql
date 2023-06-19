CREATE TABLE public.users (
    id_user serial NOT NULL,
    username VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    email varchar NULL,
    "role" VARCHAR NULL DEFAULT 'user',
    created_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    CONSTRAINT users_pk PRIMARY KEY (id_user),
    CONSTRAINT users_un UNIQUE (username)
);