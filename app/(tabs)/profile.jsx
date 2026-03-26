import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/context/AuthContext";
import { getUserStats, getMe, changePassword } from "../../src/api/api";
import { profileStyles as styles } from "../../src/styles/profileStyles";

export default function Profile() {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);

  // modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, []),
  );

  const loadStats = async () => {
    setLoading(true);
    try {
      const [statsRes, meRes] = await Promise.all([getUserStats(), getMe()]);
      setStats(statsRes.data);
      setEmail(meRes.data.email);
    } catch (e) {
      console.log("Failed to load profile!", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    logout();
  };

  const openModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
    setPasswordSuccess(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleChangePassword = async () => {
    setPasswordError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current.");
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (e) {
      setPasswordError(e.response?.data || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#E50914" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar + username + email */}
        <View style={styles.avatarSection}>
          <Ionicons name="person-circle-outline" size={90} color="#E50914" />
          <Text style={styles.username}>{user}</Text>
          {email && <Text style={styles.email}>{email}</Text>}
        </View>

        {/* Stats */}
        {stats && (
          <View>
            <Text style={styles.sectionTitle}>My Activity</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons
                  name="film-outline"
                  size={22}
                  color="#E50914"
                  style={styles.statIcon}
                />
                <Text style={styles.statNumber}>{stats.totalMovies}</Text>
                <Text style={styles.statLabel}>Movies</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons
                  name="tv-outline"
                  size={22}
                  color="#E50914"
                  style={styles.statIcon}
                />
                <Text style={styles.statNumber}>{stats.totalTvShows}</Text>
                <Text style={styles.statLabel}>TV Shows</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons
                  name="chatbubble-outline"
                  size={22}
                  color="#E50914"
                  style={styles.statIcon}
                />
                <Text style={styles.statNumber}>{stats.totalReviews}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons
                  name="thumbs-up-outline"
                  size={22}
                  color="#22c55e"
                  style={styles.statIcon}
                />
                <Text style={styles.statNumber}>{stats.positiveReviews}</Text>
                <Text style={styles.statLabel}>Positive</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons
                  name="thumbs-down-outline"
                  size={22}
                  color="#ef4444"
                  style={styles.statIcon}
                />
                <Text style={styles.statNumber}>{stats.negativeReviews}</Text>
                <Text style={styles.statLabel}>Negative</Text>
              </View>
            </View>
          </View>
        )}

        {/* Change password button */}
        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={openModal}
        >
          <Ionicons name="lock-closed-outline" size={20} color="white" />
          <Text style={styles.changePasswordText}>Change Password</Text>
        </TouchableOpacity>

        {/* Logout button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#E50914" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Change password modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalBox}>
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Success state */}
            {passwordSuccess ? (
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
                <Text style={styles.successText}>Password changed!</Text>
              </View>
            ) : (
              <View>
                {/* Error */}
                {passwordError && (
                  <View style={styles.modalError}>
                    <Text style={styles.modalErrorText}>{passwordError}</Text>
                  </View>
                )}

                {/* Current password */}
                <Text style={styles.modalLabel}>Current Password</Text>
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="#555"
                  secureTextEntry
                  style={styles.modalInput}
                />

                {/* New password */}
                <Text style={styles.modalLabel}>New Password</Text>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#555"
                  secureTextEntry
                  style={styles.modalInput}
                />

                {/* Confirm password */}
                <Text style={styles.modalLabel}>Confirm New Password</Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#555"
                  secureTextEntry
                  style={styles.modalInput}
                />

                {/* Submit */}
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    changingPassword && { backgroundColor: "#333" },
                  ]}
                  onPress={handleChangePassword}
                  disabled={changingPassword}
                >
                  {changingPassword ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.modalButtonText}>Change Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
