package com.sunu.apte.Config;

import com.sunu.apte.Entity.Pays;
import com.sunu.apte.Repository.PaysRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoadDatabase {

	@Bean
	CommandLineRunner initDatabase(PaysRepository repository) {
	    return args -> {
	        addCountryIfNotExists(repository, "Benin");
	        addCountryIfNotExists(repository, "Burkina");
	        addCountryIfNotExists(repository, "Congo");
	        addCountryIfNotExists(repository, "Mali");
	        addCountryIfNotExists(repository, "Mauritanie");
	        addCountryIfNotExists(repository, "Niger");
	        addCountryIfNotExists(repository, "RDC");
	        addCountryIfNotExists(repository, "Senegal");
	        addCountryIfNotExists(repository, "Togo");
	    };
	}

	private void addCountryIfNotExists(PaysRepository repository, String countryName) {
	    if (!repository.findByName(countryName).isPresent()) {
	        repository.save(new Pays(countryName, false, false));
	    }
	}
}
