import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { idroApi } from '../services/api';
import VolunteerForm from './VolunteerForm';

// Mock the API
jest.mock('../services/api', () => ({
  idroApi: {
    getAlerts: jest.fn(),
    submitReport: jest.fn(),
    updateReport: jest.fn(),
    createCamp: jest.fn(),
  },
}));

describe('VolunteerForm Submission', () => {
  beforeEach(() => {
    // Reset mocks
    idroApi.getAlerts.mockResolvedValue({
      data: [
        {
          id: '1',
          location: 'Test Location',
          type: 'FLOOD',
          missionStatus: 'OPEN'
        }
      ]
    });
    idroApi.submitReport.mockResolvedValue({ data: { id: '123' } });
    idroApi.createCamp.mockResolvedValue({ data: { id: '456' } });
  });

  test('submits form with correct payload structure', async () => {
    render(<VolunteerForm />);

    // Wait for alerts to load
    await waitFor(() => {
      expect(idroApi.getAlerts).toHaveBeenCalled();
    });

    // Fill out the form
    fireEvent.change(screen.getByDisplayValue('-- Select Detected Zone --'), {
      target: { value: 'Test Location' }
    });

    fireEvent.change(screen.getByPlaceholderText('People Affected (Count)'), {
      target: { value: '100' }
    });

    fireEvent.change(screen.getByPlaceholderText('Injured (Count)'), {
      target: { value: '10' }
    });

    fireEvent.change(screen.getByPlaceholderText('Missing (Est.)'), {
      target: { value: '5' }
    });

    fireEvent.change(screen.getByPlaceholderText('Verified By (Volunteer Name / ID)'), {
      target: { value: 'Test Volunteer' }
    });

    // Submit the form
    fireEvent.click(screen.getByText('TRANSMIT INTEL TO COMMAND'));

    // Verify the API was called with correct payload
    await waitFor(() => {
      expect(idroApi.submitReport).toHaveBeenCalledWith({
        location: 'Test Location',
        type: 'FLOOD',
        color: 'YELLOW',
        magnitude: 'Medium',
        affectedCount: 100,
        injuredCount: 10,
        missing: '5',
        details: 'Infra: . Needs: . Verified by: Test Volunteer',
        impact: 'Camps Active: 0. Missing: 5',
        reporterLevel: 'VOLUNTEER',
        sourceType: 'VOLUNTEER-APP',
        missionStatus: 'OPEN',
        time: expect.any(String),
        latitude: 0.0,
        longitude: 0.0,
        trustScore: 75
      });
    });
  });

  test('handles submission errors gracefully', async () => {
    idroApi.submitReport.mockRejectedValue(new Error('Network error'));

    render(<VolunteerForm />);

    // Wait for alerts to load
    await waitFor(() => {
      expect(idroApi.getAlerts).toHaveBeenCalled();
    });

    // Fill minimal required fields
    fireEvent.change(screen.getByDisplayValue('-- Select Detected Zone --'), {
      target: { value: 'Test Location' }
    });

    // Submit the form
    fireEvent.click(screen.getByText('TRANSMIT INTEL TO COMMAND'));

    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText('❌ Submission Failed. Check Console for details.')).toBeInTheDocument();
    });
  });
});
