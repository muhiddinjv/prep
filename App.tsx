import React from "react";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import {SafeAreaProvider} from 'react-native-safe-area-context';

import AppNavigator from "./src/navigation/AppNavigator";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#2E7D32" />
        <AppNavigator />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

// export default function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <SafeAreaProvider>
//         <SafeAreaView>
//           <StatusBar style="light" />
//           <AppNavigator />
//         </SafeAreaView>
//       </SafeAreaProvider>
//     </QueryClientProvider>
//   );
// }


