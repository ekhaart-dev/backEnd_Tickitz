CREATE TABLE public.movie_schedule (
	id_movie_schedule serial NOT NULL,
	id_movie int NOT NULL,
	id_schedule int NOT NULL,
	CONSTRAINT movie_schedule_pk PRIMARY KEY (id_movie_schedule),
	CONSTRAINT movie_schedule_fk FOREIGN KEY (id_movie) REFERENCES public.movies(id_movie) ON DELETE CASCADE,
	CONSTRAINT movie_schedule_fk_1 FOREIGN KEY (id_schedule) REFERENCES public.schedules(id_schedule) ON DELETE CASCADE
);
