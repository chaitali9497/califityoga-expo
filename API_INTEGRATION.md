# API Integration Guide

Your frontend is now connected to the backend at: **https://califityoga-expo.onrender.com**

## File Structure

```
src/
├── config/
│   ├── api.ts              # API configuration & endpoints
│   └── axiosInstance.js    # Axios HTTP client
├── services/
│   ├── authService.ts      # Authentication API calls
│   └── habitService.ts     # Habits API calls
```

## Usage Examples

### Authentication

```typescript
import {
  login,
  register,
  getApiErrorMessage,
} from "@/src/services/authService";

// Register a new user
const handleRegister = async (email: string, password: string) => {
  try {
    const response = await register({ email, password, name: "" });
    console.log("Token:", response.token);
    // Save token to AsyncStorage
  } catch (error) {
    console.error(getApiErrorMessage(error));
  }
};

// Login user
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await login({ email, password, name: "" });
    console.log("Token:", response.token);
    // Save token to AsyncStorage
  } catch (error) {
    console.error(getApiErrorMessage(error));
  }
};
```

### Habits Management

```typescript
import {
  getAllHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  getApiErrorMessage,
} from "@/src/services/habitService";

// Get all habits
const fetchHabits = async () => {
  try {
    const habits = await getAllHabits();
    console.log(habits);
  } catch (error) {
    console.error(getApiErrorMessage(error));
  }
};

// Create a habit
const addHabit = async () => {
  try {
    const newHabit = await createHabit({
      title: "Morning Exercise",
      description: "30 min exercise",
      category: "fitness",
      frequency: "daily",
      color: "#2E7D32",
      icon: "💪",
    });
    console.log("Habit created:", newHabit);
  } catch (error) {
    console.error(getApiErrorMessage(error));
  }
};

// Update a habit
const editHabit = async (habitId: string) => {
  try {
    const updated = await updateHabit(habitId, {
      title: "Updated Title",
    });
    console.log("Habit updated:", updated);
  } catch (error) {
    console.error(getApiErrorMessage(error));
  }
};

// Delete a habit
const removeHabit = async (habitId: string) => {
  try {
    await deleteHabit(habitId);
    console.log("Habit deleted");
  } catch (error) {
    console.error(getApiErrorMessage(error));
  }
};
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Habits

- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create habit
- `GET /api/habits/:id` - Get specific habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit

### Health

- `GET /api/health` - Check API health

## Authentication Token

After login/register, save the token:

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

const token = response.token;
await AsyncStorage.setItem("authToken", token);
```

Then add interceptor in `axiosInstance.js` to include token in requests:

```typescript
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
```

## Backend URL

The backend is deployed at: **https://califityoga-expo.onrender.com**

To change it, update `src/config/api.ts`:

```typescript
const API_BASE_URL = "https://your-backend-url.com";
```

## Troubleshooting

- **Connection errors**: Ensure the backend URL is correct and the server is running
- **CORS errors**: Configure CORS on the backend if needed
- **Token errors**: Make sure token is properly saved and sent with requests
- **Network timeout**: Check network connection and backend availability
