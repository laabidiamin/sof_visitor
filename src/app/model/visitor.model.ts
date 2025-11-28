export type ServiceType = 'smart-badge' | 'room-booking' | 'parking' | 'premium-wifi' | 'tech-support' | 'translation';

export interface Service {
  id: ServiceType;
  name: string;
  description: string;
  icon: string;
}

export interface Visitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  purpose: string;
  checkInTime: Date;
  checkOutTime: Date | null;
  status: 'checked-in' | 'checked-out';
  badge?: string;
  services: ServiceType[];
}

export interface VisitorStats {
  totalToday: number;
  currentlyCheckedIn: number;
  checkedOut: number;
  averageStayTime: number;
}

export const AVAILABLE_SERVICES: Service[] = [
  {
    id: 'smart-badge',
    name: 'Smart Badge',
    description: 'Badge d\'accès intelligent',
    icon: 'M10 1a4 4 0 014 4v2h-1V5a3 3 0 00-3-3H9a3 3 0 00-3 3v2H5V5a4 4 0 014-4h1zm10 1a2 2 0 012 2v2h-1V4a1 1 0 00-1-1h-1v1h1zm-3 0h-1v1h1a1 1 0 011 1v2h1V4a2 2 0 00-2-2zm-7 5h8v1H9V7zm0 2h8v1H9V9z'
  },
  {
    id: 'room-booking',
    name: 'Room Booking',
    description: 'Réservation de salle',
    icon: 'M2 4a1 1 0 011-1h14a1 1 0 011 1v2h1V4a2 2 0 00-2-2H3a2 2 0 00-2 2v2h1V4zm0 4h16v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8zm8 4a1 1 0 100-2 1 1 0 000 2z'
  },
  {
    id: 'parking',
    name: 'Parking',
    description: 'Place de parking',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z'
  },
  {
    id: 'premium-wifi',
    name: 'Premium WiFi',
    description: 'WiFi haut débit',
    icon: 'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z'
  },
  {
    id: 'tech-support',
    name: 'Tech Support',
    description: 'Support technique',
    icon: 'M11 17c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1zm6-5c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6 6 2.69 6 6zm2 0c0-4.42-3.58-8-8-8s-8 3.58-8 8 3.58 8 8 8 8-3.58 8-8zM8 19h8v2H8z'
  },
  {
    id: 'translation',
    name: 'Translation',
    description: 'Service de traduction',
    icon: 'M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 001.07 6.27a1.5 1.5 0 012.05.04l5.01 5.01c.494-.494.94-1.02 1.34-1.58.43-.5.82-1.04 1.17-1.6.02 0 .03.01.04.02.02-.02.05-.02.07 0l5.01-5.01c.58-.58 1.53-.58 2.11 0l1.41 1.41c.58.58.58 1.53 0 2.11l-5.01 5.01c.03.02.03.05.01.07-.55.35-1.1.75-1.6 1.17-.59.39-1.09.85-1.58 1.34l-.03.03 2.51 2.54c.77.77.77 2.03 0 2.8l-1.41 1.41c-.77.77-2.03.77-2.8 0z'
  }
];
