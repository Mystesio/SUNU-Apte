package com.sunu.apte;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.sunu.apte.Service.MyUserDetailService;

@SpringBootTest
class ApteBackApplicationTests {

    @Autowired
    private MyUserDetailService userDetailService;

    @Test
    void contextLoads() {
        // Vérifiez que le service utilisateur est injecté correctement
        assertNotNull(userDetailService);
    }
}
