import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform, FlatList, RefreshControl } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { AuthContext } from '../navigation/AuthProvider';
import { useFetchFunctions } from '../infrastructures/functions';
import { API } from '../config/api';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EVENT_ICONS = {
  GTOT: "arrow-up-from-bracket",
  GTIN: "arrow-down-to-bracket",
  LOAD: "ship",
  DISC: "anchor",
  ARRI: "location-dot",
  DEPA: "route",
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default function ContainerTracking({ route, navigation }) {
  const { carrierBookingReference, subscriptionStatus } = route.params;
  const initialEvents = route.params.events || route.params.initialPosition ? [] : [];
  const { token, language } = useContext(AuthContext);
  const { postFunction } = useFetchFunctions();
  const t = (en, fr) => language === "English" ? en : fr;

  const [events, setEvents] = useState(route.params.events || []);
  const [loading, setLoading] = useState(events.length === 0);
  const [refreshing, setRefreshing] = useState(false);
  const [subStatus, setSubStatus] = useState(subscriptionStatus);

  const fetchEvents = useCallback(async (isRefresh) => {
    if (isRefresh) setRefreshing(true);
    try {
      const data = await postFunction(
        API.TRACKING_POSITION,
        { carrierBookingReference },
        token
      );
      if (data && data.status === 0) {
        if (data.events) setEvents(data.events);
        if (data.subscription) setSubStatus(data.subscription.status);
      }
    } catch (err) {
      console.log(err);
    }
    setRefreshing(false);
    setLoading(false);
  }, [carrierBookingReference, token]);

  useEffect(() => {
    if (events.length === 0) {
      fetchEvents(false);
    }
  }, []);

  const renderEvent = ({ item, index }) => {
    const isLast = index === events.length - 1;
    const iconName = EVENT_ICONS[item.eventType] || "circle-dot";

    return (
      <View style={styles.eventRow}>
        <View style={styles.timelineCol}>
          <View style={[styles.dot, isLast && styles.dotActive]}>
            <FontAwesome6 name={iconName} size={12} color={isLast ? "#fff" : COLORS.primary} />
          </View>
          {!isLast && <View style={styles.line} />}
        </View>

        <View style={[styles.eventCard, isLast && styles.eventCardActive]}>
          <Text style={[styles.eventTitle, isLast && styles.eventTitleActive]}>
            {item.eventDescription || item.eventType || t("Position update", "Mise à jour")}
          </Text>

          {item.locationName && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={14} color={isLast ? COLORS.primary : "#888"} />
              <Text style={styles.infoText}>
                {item.locationName}{item.unLocationCode ? ` (${item.unLocationCode})` : ""}
              </Text>
            </View>
          )}

          {item.transportMode && (
            <View style={styles.infoRow}>
              <Ionicons name={item.transportMode === "Maritime" ? "boat-outline" : item.transportMode === "Rail" ? "train-outline" : "car-outline"} size={14} color="#888" />
              <Text style={styles.infoText}>{item.transportMode}</Text>
            </View>
          )}

          {item.vesselName && (
            <View style={styles.infoRow}>
              <Ionicons name="boat-outline" size={14} color="#888" />
              <Text style={styles.infoText}>{item.vesselName}</Text>
            </View>
          )}

          {item.equipmentReference && (
            <View style={styles.infoRow}>
              <Ionicons name="cube-outline" size={14} color="#888" />
              <Text style={styles.infoText}>{item.equipmentReference}</Text>
            </View>
          )}

          <Text style={styles.dateText}>{formatDate(item.eventDateTime)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome6 name="angle-left" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {t("Tracking", "Suivi")} - {carrierBookingReference}
          </Text>
          <Text style={styles.headerSubtitle}>
            {subStatus === "active"
              ? t("Subscription active", "Abonnement actif")
              : subStatus === "pending"
              ? t("Waiting for data...", "En attente de données...")
              : subStatus === "error"
              ? t("Subscription error", "Erreur d'abonnement")
              : t("Tracking", "Suivi")}
          </Text>
        </View>
        <TouchableOpacity onPress={() => fetchEvents(true)} disabled={refreshing} style={{ padding: 5 }}>
          {refreshing
            ? <ActivityIndicator color="#fff" />
            : <Ionicons name="refresh" size={22} color="#fff" />}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>{t("Loading itinerary...", "Chargement de l'itinéraire...")}</Text>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="navigate-outline" size={50} color="#ccc" />
          <Text style={styles.emptyTitle}>
            {t("No events yet", "Aucun événement")}
          </Text>
          <Text style={styles.emptyText}>
            {t(
              "Hapag-Lloyd will send tracking updates as your container moves. Pull down to refresh.",
              "Hapag-Lloyd enverra les mises à jour de suivi au fur et à mesure du trajet. Tirez vers le bas pour actualiser."
            )}
          </Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={() => fetchEvents(true)}>
            <Text style={styles.refreshBtnText}>{t("Refresh", "Actualiser")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item, index) => item._id || String(index)}
          renderItem={renderEvent}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchEvents(true)} tintColor={COLORS.primary} />
          }
          ListHeaderComponent={() => (
            <View style={styles.summaryBar}>
              <Text style={styles.summaryText}>
                {events.length} {t("event(s)", "événement(s)")}
              </Text>
              {events.length > 0 && events[events.length - 1].locationName && (
                <Text style={styles.summaryLocation}>
                  {t("Last: ", "Dernier: ")}{events[events.length - 1].locationName}
                </Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 55 : 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  backButton: { marginRight: 12, padding: 5 },
  headerTitle: { color: '#fff', fontFamily: FONTS.bold, fontSize: SIZES.h5 },
  headerSubtitle: { color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.regular, fontSize: SIZES.h7, marginTop: 2 },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  loadingText: { marginTop: 10, fontFamily: FONTS.regular, color: '#666' },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: SIZES.h4, color: '#333', marginTop: 15 },
  emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.h6, color: '#888', textAlign: 'center', marginTop: 10, lineHeight: 22 },
  refreshBtn: { marginTop: 20, backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 8 },
  refreshBtnText: { color: '#fff', fontFamily: FONTS.bold, fontSize: SIZES.h6 },

  listContent: { paddingHorizontal: 15, paddingTop: 5, paddingBottom: 30 },

  summaryBar: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryText: { fontFamily: FONTS.bold, fontSize: SIZES.h5, color: COLORS.primary },
  summaryLocation: { fontFamily: FONTS.regular, fontSize: SIZES.h7, color: '#666', marginTop: 4 },

  eventRow: { flexDirection: 'row', minHeight: 80 },

  timelineCol: { width: 40, alignItems: 'center' },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e8f0fe',
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotActive: { backgroundColor: COLORS.primary },
  line: { width: 2, flex: 1, backgroundColor: COLORS.primary, opacity: 0.3 },

  eventCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginLeft: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  eventCardActive: { borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  eventTitle: { fontFamily: FONTS.bold, fontSize: SIZES.h6, color: '#333' },
  eventTitleActive: { color: COLORS.primary },

  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  infoText: { fontFamily: FONTS.regular, fontSize: SIZES.h7, color: '#666', marginLeft: 6 },

  dateText: { fontFamily: FONTS.regular, fontSize: SIZES.h7, color: '#aaa', marginTop: 8 },
});
