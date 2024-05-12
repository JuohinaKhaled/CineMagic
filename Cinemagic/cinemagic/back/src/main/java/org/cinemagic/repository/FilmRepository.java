package org.cinemagic.repository;

import org.cinemagic.models.Filme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FilmRepository extends JpaRepository<Filme, Long> {
}
