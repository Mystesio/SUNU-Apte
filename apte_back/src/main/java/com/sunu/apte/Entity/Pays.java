package com.sunu.apte.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Pays {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private boolean sunulifeState;
    private boolean sunupacState;

    // Constructeur par défaut
    public Pays() {}

    // Constructeur avec arguments
    public Pays(String name, boolean sunulifeState, boolean sunupacState) {
        this.name = name;
        this.sunulifeState = sunulifeState;
        this.sunupacState = sunupacState;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isSunulifeState() {
        return sunulifeState;
    }

    public void setSunulifeState(boolean sunulifeState) {
        this.sunulifeState = sunulifeState;
    }

    public boolean isSunupacState() {
        return sunupacState;
    }

    public void setSunupacState(boolean sunupacState) {
        this.sunupacState = sunupacState;
    }
}

