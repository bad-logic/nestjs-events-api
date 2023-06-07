INSERT INTO 
`profiles`(
    `id`,
    `firstName`,
    `lastName`
    )
VALUES(
     NULL,
     'End',
    'To End'
    );

INSERT INTO 
`profiles`(
    `id`,
    `firstName`,
    `lastName`
    )
VALUES(
     NULL,
     'End',
    'To End'
    );

INSERT INTO
    `users` (
        `id`,
        `username`,
        `password`,
        `email`,
        `profile_id`
    )
VALUES
    (
        NULL,
        'e2e-test',
        '$2b$10$5v5ZIVbPGXf0126yUiiys.z/POxSaus.iSbzXj7cTRW9KWGy5bfcq',
        'e2e@test.com',
        1
    );

INSERT INTO
    `users` (
        `id`,
        `username`,
        `password`,
        `email`,
        `profile_id`
    )
VALUES
    (
        NULL,
        'nasty',
        '$2b$10$5v5ZIVbPGXf0126yUiiys.z/POxSaus.iSbzXj7cTRW9KWGy5bfcq',
        'nasty@test.com',
        2
    );

INSERT INTO
    `events` (
        `id`,
        `description`,
        `when`,
        `address`,
        `name`,
        `organizer_id`
    )
VALUES
    (
        NULL,
        'That is a crazy event, must go there!',
        '2021-04-15 21:00:00',
        'Local St 101',
        'Interesting Party',
        1
    );

INSERT INTO
    `events` (
        `id`,
        `description`,
        `when`,
        `address`,
        `name`,
        `organizer_id`
    )
VALUES
    (
        NULL,
        'That is a nice event, must go there!',
        '2021-04-15 21:00:00',
        'Local St 101',
        'Interesting Party',
        1
    );