CREATE TABLE public.schedules (
    id_schedule serial NOT NULL,
    price INT NOT NULL,
    premiere VARCHAR NULL,
    place VARCHAR NULL,
    date_start DATE NOT NULL,
    date_end DATE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    CONSTRAINT schedule_pk PRIMARY KEY (id_schedule)
);