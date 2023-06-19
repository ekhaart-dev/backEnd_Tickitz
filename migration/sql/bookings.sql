CREATE TABLE public.bookings (
    id_booking serial NOT NULL,
    id_movie INT NOT NULL,
    created_at timestamp without time zone NULL DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    CONSTRAINT booking_pk PRIMARY KEY (id_booking),
    CONSTRAINT booking_fk FOREIGN KEY (id_movie) REFERENCES public.movies(id_movie) ON DELETE CASCADE
);