package com.example.board.service;

import com.example.board.entity.Event;
import com.example.board.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<Event> findAll() {
        return eventRepository.findAllByOrderByStartDateDesc();
    }

    public List<Event> findByDateRange(String startDate, String endDate) {
        return eventRepository.findByDateRange(startDate, endDate);
    }

    public List<Event> findByDate(String date) {
        return eventRepository.findByDate(date);
    }

    public Event save(Event event) {
        return eventRepository.save(event);
    }

    public Event update(Long id, Event updated) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
        event.setContent(updated.getContent());
        event.setStartDate(updated.getStartDate());
        event.setEndDate(updated.getEndDate());
        return eventRepository.save(event);
    }

    public void delete(Long id) {
        eventRepository.deleteById(id);
    }

    public void deleteAll(List<Long> ids) {
        eventRepository.deleteAllById(ids);
    }
}
