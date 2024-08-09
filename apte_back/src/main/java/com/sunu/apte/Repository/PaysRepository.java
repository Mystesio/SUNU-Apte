package com.sunu.apte.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sunu.apte.Entity.Pays;

public interface PaysRepository extends JpaRepository<Pays, Long> {
    Optional<Pays> findByName(String name);
}