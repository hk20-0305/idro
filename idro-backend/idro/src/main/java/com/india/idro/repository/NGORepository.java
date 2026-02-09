package com.india.idro.repository;

import com.india.idro.model.NGO;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NGORepository extends MongoRepository<NGO, String> {
    Optional<NGO> findByNgoId(String ngoId);
}
