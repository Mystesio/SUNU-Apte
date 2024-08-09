package com.sunu.apte.Controller;

import com.sunu.apte.Entity.Pays;
import com.sunu.apte.Service.PaysService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/pays")
public class PaysController {

    @Autowired
    private PaysService paysService;

    @GetMapping("/update")
    public List<Pays> updatePaysList() throws IOException, InterruptedException {
        return paysService.updatePays();
    }
}