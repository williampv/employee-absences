# Employee Absences Manager

A comprehensive employee absence tracking system built with Nuxt 4 and Vuetify 3. This application provides an intuitive calendar interface for managing employee absences with virtual scrolling for optimal performance with large datasets.

## Features

### 📅 Calendar View
- **Full Year Display**: Shows all 365 days of the current year
- **Visual Indicators**: 
  - 🟢 Green cells for present days
  - 🔴 Red cells for absent days
  - ⚫ Grey cells for weekends (non-working days)
  - 🔵 Blue border for today's date
- **Interactive Cells**: Click any cell to manage absences

### 🚀 Performance Optimizations
- **Virtual Scrolling**: Handles large datasets efficiently in both horizontal and vertical directions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Optimized Rendering**: Only renders visible calendar cells

### 💼 Absence Management
- **Create Absences**: Add new absences for any employee and date range
- **Edit Absences**: Modify existing absence details
- **Delete Absences**: Remove absences with confirmation
- **Multiple Absence Types**: Sick leave, vacation, personal leave, and other
- **Conflict Detection**: Warns when creating overlapping absences

### 📊 Dashboard & Analytics
- **Statistics Overview**: Real-time statistics showing:
  - Total present days
  - Total absent days
  - Number of employees
  - Total absence records
- **Visual Indicators**: Color-coded absence types with icons

### 🎨 User Experience
- **Tooltips**: Hover over cells for detailed information
- **Notifications**: Toast notifications for all actions
- **Loading States**: Visual feedback during operations
- **Responsive Layout**: Adapts to different screen sizes
- **Smooth Animations**: Polished transitions and hover effects

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Composition API**: Modern Vue 3 composition API with composables
- **State Management**: Reactive state management with Nuxt composables
- **Component Architecture**: Modular, reusable components
- **GraphQL Ready**: Data structure prepared for easy backend integration

## Project Structure

```
├── app/
│   ├── app.vue                 # Main application component
│   └── plugins/
│       └── vuetify.ts         # Vuetify plugin configuration
├── components/
│   ├── AbsenceCalendarTable.vue    # Main calendar table component
│   ├── AbsenceDialog.vue           # Absence management dialog
│   ├── AbsenceStats.vue            # Statistics dashboard
│   ├── NotificationContainer.vue   # Toast notifications
│   └── VirtualScrollCalendar.vue   # Virtual scrolling wrapper
├── composables/
│   ├── useAbsences.ts              # Absence data management
│   └── useNotifications.ts         # Notification system
├── types/
│   └── absence.ts                  # TypeScript interfaces
└── nuxt.config.ts                  # Nuxt configuration
```

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Usage

### Viewing Absences
1. The calendar displays all employees and dates for the current year
2. Green cells indicate present days, red cells indicate absences
3. Grey cells represent weekends (non-working days)
4. Today's date is highlighted with a blue border

### Managing Absences
1. **Create**: Click on any green cell to add a new absence
2. **Edit**: Click on any red cell to modify an existing absence
3. **Delete**: Use the delete button in the edit dialog

### Absence Types
- **Sick Leave** 🏥: Medical-related absences
- **Vacation** 🏖️: Holiday and time off
- **Personal Leave** 👤: Personal appointments and errands
- **Other** ❓: Miscellaneous absences

## Data Structure

The application uses the following data structures:

### Employee
```typescript
interface Employee {
  id: string
  firstName: string
  lastName: string
  personnelNumber: string
}
```

### Absence
```typescript
interface Absence {
  id: string
  employeeId: string
  startDate: string    // ISO date string
  endDate: string      // ISO date string
  type: 'sick' | 'vacation' | 'personal' | 'other'
  reason?: string
  createdAt: string
  updatedAt: string
}
```

## Backend Integration

The application is structured to easily integrate with a GraphQL backend:

1. **Composables**: The `useAbsences` composable can be extended to make API calls
2. **Data Structure**: All data follows GraphQL-friendly patterns
3. **Real-time Updates**: State management supports live data synchronization
4. **Error Handling**: Comprehensive error handling for network operations

## Production Build

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Technologies Used

- **Nuxt 4**: Full-stack Vue framework
- **Vue 3**: Progressive JavaScript framework with Composition API
- **Vuetify 3**: Material Design component framework
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.