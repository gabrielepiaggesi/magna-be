CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    birthday DATE,
    last_ip VARCHAR(255) NOT NULL,
    accept_terms_and_condition TINYINT(1) DEFAULT 0,
    last_session TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;

alter table users add age BIGINT NOT NULL DEFAULT 18;
alter table users add cv_url VARCHAR(255) DEFAULT NULL;
alter table users add phone_number VARCHAR(255) DEFAULT NULL;
alter table users add image_url VARCHAR(255) DEFAULT NULL;


CREATE TABLE IF NOT EXISTS companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    website VARCHAR(255) DEFAULT NULL,
    logo VARCHAR(255) DEFAULT NULL,
    birthdate DATE,
    employees_number BIGINT NOT NULL DEFAULT 1,
    hq_country VARCHAR(255) DEFAULT NULL,
    hq_city VARCHAR(255) DEFAULT NULL,
    hq_address VARCHAR(255) DEFAULT NULL,
    category VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS users_companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    status VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS users_data_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    option_key VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS users_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    option_id BIGINT NOT NULL,
    string_value VARCHAR(255) DEFAULT NULL,
    number_value DOUBLE(16,4) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS job_offers_users_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_offer_id BIGINT NOT NULL,
    option_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS quizs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_user_id BIGINT NOT NULL,
    topic VARCHAR(255) NOT NULL,
    minutes BIGINT NOT NULL,
    check_camera TINYINT(1) DEFAULT 0,
    check_mic TINYINT(1) DEFAULT 0,
    category VARCHAR(255) DEFAULT NULL,
    tests_amount BIGINT DEFAULT NULL,
    tests_points BIGINT DEFAULT NULL,
    public TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS tests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    question VARCHAR(255) NOT NULL,
    minutes BIGINT NOT NULL,
    type VARCHAR(255) NOT NULL,
    points BIGINT NOT NULL,
    position_order BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS tests_texts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    test_id BIGINT NOT NULL,
    text VARCHAR(255) NOT NULL,
    position_order BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS tests_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    test_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    position_order BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS tests_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    test_id BIGINT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    is_correct TINYINT(1) DEFAULT 0,
    points BIGINT NOT NULL,
    position_order BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS job_offers_quizs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    job_offer_id BIGINT NOT NULL,
    position_order BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS users_quizs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    status VARCHAR(255) NOT NULL,
    score BIGINT DEFAULT 0,
    rate BIGINT DEFAULT 0,
    tests_given BIGINT DEFAULT 0,
    tests_right BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS companies_quizs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS job_offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_user_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    status VARCHAR(255) NOT NULL,
    lang VARCHAR(255) DEFAULT NULL,
    role VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address VARCHAR(255) DEFAULT NULL,
    equipment VARCHAR(255) DEFAULT NULL,
    description VARCHAR(255) NOT NULL,
    mode VARCHAR(255) NOT NULL,
    type VARCHAR(255) DEFAULT NULL,
    public TINYINT(1) DEFAULT 0,
    contract_timing VARCHAR(255) NOT NULL,
    contract_type VARCHAR(255) NOT NULL,
    salary_range VARCHAR(255) DEFAULT NULL,
    expired_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS job_offers_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_offer_id BIGINT NOT NULL,
    text VARCHAR(255) NOT NULL,
    required TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS users_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    confidence_level BIGINT NOT NULL,
    years BIGINT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


alter table job_offers_skills add quiz_id BIGINT DEFAULT NULL;


CREATE TABLE IF NOT EXISTS users_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    job_offer_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    status VARCHAR(255) NOT NULL,
    note VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


alter table users_quizs add job_offer_id BIGINT NOT NULL;

ALTER TABLE users_applications MODIFY COLUMN note VARCHAR(255) DEFAULT NULL;


CREATE TABLE IF NOT EXISTS users_tests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    test_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    option_id BIGINT DEFAULT NULL,
    answer VARCHAR(255) DEFAULT NULL,
    score BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;


alter table quizs add difficulty_level BIGINT NOT NULL;


alter table tests add difficulty_level BIGINT NOT NULL;


CREATE TABLE IF NOT EXISTS media (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    extension VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,
    url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
)  ENGINE=INNODB;

alter table users add image_id BIGINT DEFAULT NULL;
alter table companies add image_id BIGINT DEFAULT NULL;
alter table tests_images add image_id BIGINT DEFAULT NULL;

ALTER TABLE users CHANGE image_id media_id BIGINT DEFAULT NULL;
ALTER TABLE companies CHANGE image_id media_id BIGINT DEFAULT NULL;
ALTER TABLE tests_images CHANGE image_id media_id BIGINT DEFAULT NULL;

alter table users_tests add media_id BIGINT DEFAULT NULL;

alter table users add description VARCHAR(255) DEFAULT NULL;

ALTER TABLE users CHANGE birthday birthdate TIMESTAMP DEFAULT NULL;

alter table companies add description VARCHAR(255) DEFAULT NULL;

alter table companies add email VARCHAR(255) DEFAULT NULL;

ALTER TABLE companies CHANGE employees_number employees_amount BIGINT DEFAULT NULL;

ALTER TABLE users MODIFY COLUMN last_ip VARCHAR(255) DEFAULT NULL;

alter table users_data add job_offer_id BIGINT NOT NULL;

ALTER TABLE users_data CHANGE option_id job_offer_user_data_id BIGINT NOT NULL;

ALTER TABLE users_data DROP COLUMN job_offer_id;

ALTER TABLE users_skills CHANGE skill_id job_offer_skill_id BIGINT NOT NULL;

alter table users_skills add job_offer_id BIGINT NOT NULL;

alter table users_data add job_offer_id BIGINT NOT NULL;

alter table users_data add user_data_option_id BIGINT NOT NULL;

ALTER TABLE users_data DROP COLUMN job_offer_user_data_id;

alter table users_tests add quiz_id BIGINT NOT NULL;

alter table companies add author_user_id BIGINT NOT NULL;

alter table job_offers_quizs add required BIGINT DEFAULT 1;

ALTER TABLE tests MODIFY COLUMN minutes BIGINT DEFAULT NULL;


ALTER IGNORE TABLE users_data_options
ADD UNIQUE INDEX option_key_idx (option_key, type);


DELETE n1 FROM users_data_options n1, users_data_options n2 WHERE n1.id > n2.id AND n1.option_key = n2.option_key;




