import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Animated, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ToastVariant = "success" | "error";

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_DURATION_MS = 4000;

// Toasts auto-dismiss after four seconds.
export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<ToastVariant>("success");
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setVisible(false);
        setMessage("");
      }
    });
  }, [opacity]);

  const showToast = useCallback(
    (nextMessage: string, nextVariant: ToastVariant = "success") => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }

      setMessage(nextMessage);
      setVariant(nextVariant);
      setVisible(true);

      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      hideTimerRef.current = setTimeout(() => {
        hideToast();
      }, TOAST_DURATION_MS);
    },
    [hideToast, opacity],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {visible ? (
        <Animated.View
          pointerEvents="none"
          style={{
            opacity,
            position: "absolute",
            left: 16,
            right: 16,
            top: insets.top + 16,
            zIndex: 9999,
          }}
        >
          <Text
            className="text-center text-white font-semibold text-base px-5 py-4 rounded-xl"
            style={{
              backgroundColor: variant === "error" ? "#EF4444" : "#AB8BFF",
            }}
          >
            {message}
          </Text>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}