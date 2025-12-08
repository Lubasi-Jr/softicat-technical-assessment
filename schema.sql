-- ENUM types
CREATE TYPE listing_type_enum AS ENUM ('PET_SITTING', 'HOUSE_SITTING', 'BOTH');
CREATE TYPE listing_status_enum AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE contact_method_enum AS ENUM ('EMAIL', 'PHONE', 'EITHER');
-- Table: User(Supertype)
CREATE TABLE "user" (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
);

-- Table: ServiceSeeker(Subtype of User)
CREATE TABLE service_seeker (
    user_id UUID PRIMARY KEY,
    address VARCHAR(255),
    preferred_contact_method contact_method_enum,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE
);

-- Table: Sitter(Subtype of User)
CREATE TABLE sitter (
    user_id UUID PRIMARY KEY,
    bio TEXT,
    years_of_experience INTEGER,
    availability_notes TEXT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE
);

-- Table: Listing
CREATE TABLE listing (
    listing_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_seeker_id UUID NOT NULL,
    listing_type listing_type_enum NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT NOT NULL,
    status listing_status_enum DEFAULT 'ACTIVE',
    FOREIGN KEY (service_seeker_id) REFERENCES service_seeker(user_id) ON DELETE CASCADE,
    CHECK (end_date >= start_date)
);

-- Table: Saved Listing(Junction Table for the many-to-many relationship)
CREATE TABLE saved_listing (
    saved_listing_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sitter_id UUID NOT NULL,
    listing_id UUID NOT NULL,
    FOREIGN KEY (sitter_id) REFERENCES sitter(user_id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listing(listing_id) ON DELETE CASCADE,
    UNIQUE(sitter_id, listing_id)
);
