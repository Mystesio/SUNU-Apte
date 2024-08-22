package com.sunu.apte.Entity;


import jakarta.persistence.*;
import lombok.Data;

import java.util.Arrays;

@Data
@Entity
@Table(name = "log")
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    @CollectionTable(name = "log_reports", joinColumns = @JoinColumn(name = "log_id"))
    @Column(name = "report")
    private String[] report;

    @ElementCollection
    @CollectionTable(name = "log_sauvegardes", joinColumns = @JoinColumn(name = "log_id"))
    @Column(name = "sauvegarde")
    private String[] sauvegarde;

    @ElementCollection
    @CollectionTable(name = "log_activities", joinColumns = @JoinColumn(name = "log_id"))
    @Column(name = "activity")
    private String[] activity;

    // Constructors
    public Log() {}

    public Log(String[] report, String[] sauvegarde, String[] activity) {
        this.report = report;
        this.sauvegarde = sauvegarde;
        this.activity = activity;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String[] getReport() {
        return report;
    }

    public void setReport(String[] report) {
        this.report = report;
    }

    public String[] getSauvegarde() {
        return sauvegarde;
    }

    public void setSauvegarde(String[] sauvegarde) {
        this.sauvegarde = sauvegarde;
    }

    public String[] getActivity() {
        return activity;
    }

    public void setActivity(String[] activity) {
        this.activity = activity;
    }

    @Override
    public String toString() {
        return "Log{" +
                "id=" + id +
                ", report=" + Arrays.toString(report) +
                ", sauvegarde=" + Arrays.toString(sauvegarde) +
                ", activity=" + Arrays.toString(activity) +
                '}';
    }
}
