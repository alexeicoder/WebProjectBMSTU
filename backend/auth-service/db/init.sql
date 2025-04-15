CREATE TABLE IF NOT EXISTS users (
    id integer NOT NULL,
    login character varying(32) NOT NULL,
    password text NOT NULL,
    name character varying(64) NOT NULL
);

INSERT INTO users (id, login, password, name) VALUES (1, 'alexei@ya.ru', '1234', 'Алексей Кузнецов');

INSERT INTO users (id, login, password, name) VALUES (2, 'ivan@ya.ru', '1234', 'Иван Тулынин');

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY users
    ADD CONSTRAINT users_login_key UNIQUE (login);