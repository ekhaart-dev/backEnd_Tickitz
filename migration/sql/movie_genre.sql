CREATE TABLE public.movie_genre (
	id_movie_genre serial NOT NULL,
	id_movie int NOT NULL,
	id_genre int NOT NULL,
	CONSTRAINT movie_genre_pk PRIMARY KEY (id_movie_genre),
	CONSTRAINT movie_genre_fk FOREIGN KEY (id_movie) REFERENCES public.movies(id_movie) ON DELETE CASCADE,
	CONSTRAINT movie_genre_fk_1 FOREIGN KEY (id_genre) REFERENCES public.genres(id_genre) ON DELETE CASCADE
);
