package com.example.board.repository;

import com.example.board.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findAllByOrderByStartDateDesc();

    @Query("SELECT e FROM Event e WHERE e.startDate <= :endDate AND e.endDate >= :startDate ORDER BY e.startDate DESC")
    List<Event> findByDateRange(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Query("SELECT e FROM Event e WHERE e.startDate <= :date AND e.endDate >= :date ORDER BY e.startDate DESC")
    List<Event> findByDate(@Param("date") String date);
}
