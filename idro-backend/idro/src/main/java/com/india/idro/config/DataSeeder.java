package com.india.idro.config;

import com.india.idro.model.User;
import com.india.idro.model.enums.UserRole;
import com.india.idro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only create users if the DB is empty
        if (userRepository.count() == 0) {
            System.out.println("No users found. Creating default admin users...");

            User gov = new User();
            gov.setUsername("admin");
            gov.setPassword("admin");
            gov.setRole(UserRole.GOV);
            gov.setEmail("admin@gov.in");
            gov.setName("Government Admin");

            User ngo = new User();
            ngo.setUsername("ngo");
            ngo.setPassword("ngo");
            ngo.setRole(UserRole.NGO);
            ngo.setEmail("contact@ngo.org");
            ngo.setName("Red Cross Logistics");

            User vol = new User();
            vol.setUsername("hero");
            vol.setPassword("hero");
            vol.setRole(UserRole.VOLUNTEER);
            vol.setEmail("hero@gmail.com");
            vol.setName("Rahul Volunteer");

            userRepository.save(gov);
            userRepository.save(ngo);
            userRepository.save(vol);
            
            System.out.println("✅ Default Users Created in MongoDB!");
        }
    }
}