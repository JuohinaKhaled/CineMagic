package org.cinemagic.services;

import org.cinemagic.models.Kunden;
import org.cinemagic.repository.KundenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.text.ParseException;
import java.util.*;

@Service
public class KundenService {

  private KundenRepository kundenRepository;
  private Map<String, Kunden> loggedInKunden = new HashMap<>();

  @Autowired
  public KundenService(KundenRepository kundenRepository) {
    this.kundenRepository = kundenRepository;
  }

  public Kunden getCurrentUser(String sessionId) {
    return loggedInKunden.get(sessionId);
  }

  public boolean login(String email, String passwort, String sessionId) throws SQLException, ParseException, ClassNotFoundException {
    Optional<Kunden> kundeOptional = kundenRepository.findKundenByEmail(email);
    if (kundeOptional.isPresent()) {
      Kunden kunde = kundeOptional.get();
      if (kunde.getPasswort().equals(passwort)) {
        loggedInKunden.put(sessionId, kunde);
        return true;
      }
    }
    return false;
  }

  public Map<String, Kunden> getTestLoggedInKunden() {
    return new HashMap<>(loggedInKunden);
  }
}
