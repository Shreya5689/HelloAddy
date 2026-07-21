import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:file_picker/file_picker.dart';
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:timezone/timezone.dart' as tz;

/// Service to handle local notifications setup, permissions, and scheduling.
class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _localNotifications = FlutterLocalNotificationsPlugin();

  /// Keys for SharedPreferences
  static const String _keyEnabled = 'notifications_enabled';
  static const String _keySoundPath = 'notification_sound_path';
  static const String _keySoundName = 'notification_sound_name';
  static const String _keyHour = 'notification_hour';
  static const String _keyMinute = 'notification_minute';

  /// Default notification time (9:00 AM)
  static const int defaultHour = 9;
  static const int defaultMinute = 0;

  /// Initialize the notification service
  Future<void> init() async {
    tz.initializeTimeZones();

    const AndroidInitializationSettings androidInitSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings iosInitSettings = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );

    const InitializationSettings initSettings = InitializationSettings(
      android: androidInitSettings,
      iOS: iosInitSettings,
    );

    await _localNotifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        // Handle notification tap here
      },
    );
  }

  /// Request permissions from the user
  Future<bool> requestPermissions() async {
    if (Platform.isAndroid) {
      final AndroidFlutterLocalNotificationsPlugin? androidImplementation =
          _localNotifications.resolvePlatformSpecificImplementation<
              AndroidFlutterLocalNotificationsPlugin>();
      final bool? granted = await androidImplementation?.requestNotificationsPermission();
      return granted ?? false;
    } else if (Platform.isIOS) {
      final iosImplementation = _localNotifications.resolvePlatformSpecificImplementation<
          IOSFlutterLocalNotificationsPlugin>();
      final bool? granted = await iosImplementation?.requestPermissions(
        alert: true,
        badge: true,
        sound: true,
      );
      return granted ?? false;
    }
    return false;
  }

  /// Check if user has granted permissions
  Future<bool> hasPermissions() async {
    if (Platform.isAndroid) {
      final AndroidFlutterLocalNotificationsPlugin? androidImplementation =
          _localNotifications.resolvePlatformSpecificImplementation<
              AndroidFlutterLocalNotificationsPlugin>();
      final bool? granted = await androidImplementation?.areNotificationsEnabled();
      return granted ?? false;
    } else if (Platform.isIOS) {
      // iOS doesn't have a direct sync checker in this plugin without requesting, 
      // but we can retrieve current settings.
      return true; // Simplified fallback for iOS settings screen logic
    }
    return true;
  }

  /// Schedule the daily mission notification
  Future<void> scheduleDailyNotification() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final bool isEnabled = prefs.getBool(_keyEnabled) ?? true;

    if (!isEnabled) {
      await cancelAllNotifications();
      return;
    }

    final int hour = prefs.getInt(_keyHour) ?? defaultHour;
    final int minute = prefs.getInt(_keyMinute) ?? defaultMinute;
    final String? customSoundPath = prefs.getString(_keySoundPath);

    // Platform-specific notification details configuration
    AndroidNotificationDetails androidDetails;
    if (customSoundPath != null && customSoundPath.isNotEmpty) {
      // Android supports URI for custom sounds on custom channels.
      // Note: Recreating the channel with a unique ID is required on Android 8.0+ 
      // if you change the sound, since channels are immutable.
      final String channelId = 'daily_mission_channel_${customSoundPath.hashCode}';
      androidDetails = AndroidNotificationDetails(
        channelId,
        'Daily Missions',
        channelDescription: 'Notifications for daily missions',
        importance: Importance.max,
        priority: Priority.high,
        playSound: true,
        sound: UriAndroidNotificationSound(customSoundPath),
      );
    } else {
      androidDetails = const AndroidNotificationDetails(
        'daily_mission_channel_default',
        'Daily Missions',
        channelDescription: 'Notifications for daily missions',
        importance: Importance.max,
        priority: Priority.high,
        playSound: true,
      );
    }

    // iOS notification details
    // Note: iOS only supports pre-bundled app assets as custom sounds.
    // Dynamic files from device picker will fallback to the default sound.
    DarwinNotificationDetails iosDetails;
    if (customSoundPath != null && customSoundPath.isNotEmpty) {
      // If you copy the file into App Group or App Bundle (must be bundled at build time),
      // we pass the file name here. Here we pass the custom sound name or path as a fallback.
      final String soundName = prefs.getString(_keySoundName) ?? 'default';
      iosDetails = DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
        sound: soundName.endsWith('.caf') || soundName.endsWith('.wav') || soundName.endsWith('.aiff')
            ? soundName
            : null, // Fallbacks to default sound if file isn't pre-bundled
      );
    } else {
      iosDetails = const DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      );
    }

    final NotificationDetails platformChannelSpecifics = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    // Cancel existing scheduled notifications to avoid duplicates
    await cancelAllNotifications();

    // Schedule notification
    await _localNotifications.zonedSchedule(
      0, // Notification ID
      'Daily Mission',
      'Your daily mission is ready! Tap to start.',
      _nextInstanceOfTime(hour, minute),
      platformChannelSpecifics,
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
      matchDateTimeComponents: DateTimeComponents.time,
    );
  }

  /// Cancels all scheduled notifications
  Future<void> cancelAllNotifications() async {
    await _localNotifications.cancelAll();
  }

  /// Calculates the next occurrence of the scheduled time
  tz.TZDateTime _nextInstanceOfTime(int hour, int minute) {
    final tz.TZDateTime now = tz.TZDateTime.now(tz.local);
    tz.TZDateTime scheduledDate =
        tz.TZDateTime(tz.local, now.year, now.month, now.day, hour, minute);
    if (scheduledDate.isBefore(now)) {
      scheduledDate = scheduledDate.add(const Duration(days: 1));
    }
    return scheduledDate;
  }
}

/// A premium, beautiful Settings UI widget for configuring Notifications.
class NotificationSettingsScreen extends StatefulWidget {
  const NotificationSettingsScreen({super.key});

  @override
  State<NotificationSettingsScreen> createState() => _NotificationSettingsScreenState();
}

class _NotificationSettingsScreenState extends State<NotificationSettingsScreen> {
  final NotificationService _notificationService = NotificationService();
  
  bool _notificationsEnabled = true;
  String _soundName = 'Default Sound';
  String? _soundPath;
  TimeOfDay _selectedTime = const TimeOfDay(hour: 9, minute: 0);
  bool _permissionGranted = false;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  /// Load existing settings from SharedPreferences
  Future<void> _loadSettings() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final bool hasPermission = await _notificationService.hasPermissions();
    
    setState(() {
      _permissionGranted = hasPermission;
      _notificationsEnabled = prefs.getBool(NotificationService._keyEnabled) ?? true;
      _soundPath = prefs.getString(NotificationService._keySoundPath);
      _soundName = prefs.getString(NotificationService._keySoundName) ?? 'Default Sound';
      
      final int hour = prefs.getInt(NotificationService._keyHour) ?? NotificationService.defaultHour;
      final int minute = prefs.getInt(NotificationService._keyMinute) ?? NotificationService.defaultMinute;
      _selectedTime = TimeOfDay(hour: hour, minute: minute);
    });
  }

  /// Toggle notification on or off
  Future<void> _toggleNotifications(bool value) async {
    // If turning on, check/request permission first
    if (value) {
      final bool granted = await _notificationService.requestPermissions();
      setState(() {
        _permissionGranted = granted;
      });
      if (!granted) {
        _showPermissionDeniedSnackbar();
        return;
      }
    }

    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setBool(NotificationService._keyEnabled, value);

    setState(() {
      _notificationsEnabled = value;
    });

    if (value) {
      await _notificationService.scheduleDailyNotification();
    } else {
      await _notificationService.cancelAllNotifications();
    }
  }

  /// Open File Picker to select custom music from device
  Future<void> _pickCustomSound() async {
    try {
      final FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.audio,
        allowMultiple: false,
      );

      if (result != null && result.files.single.path != null) {
        final PlatformFile file = result.files.single;
        final SharedPreferences prefs = await SharedPreferences.getInstance();
        
        await prefs.setString(NotificationService._keySoundPath, file.path!);
        await prefs.setString(NotificationService._keySoundName, file.name);

        setState(() {
          _soundPath = file.path;
          _soundName = file.name;
        });

        // Reschedule notification with the new sound configuration
        if (_notificationsEnabled) {
          await _notificationService.scheduleDailyNotification();
        }

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Custom sound "$_soundName" set successfully!'),
            backgroundColor: Colors.deepPurple,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to pick sound: $e'),
          backgroundColor: Colors.redAccent,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  /// Clear the custom sound and restore default sound
  Future<void> _resetToDefaultSound() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove(NotificationService._keySoundPath);
    await prefs.remove(NotificationService._keySoundName);

    setState(() {
      _soundPath = null;
      _soundName = 'Default Sound';
    });

    if (_notificationsEnabled) {
      await _notificationService.scheduleDailyNotification();
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Reset to system default sound.'),
        backgroundColor: Colors.deepPurple,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  /// Open Time Picker to select daily notification time
  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: _selectedTime,
      builder: (BuildContext context, Widget? child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.dark(
              primary: Colors.deepPurpleAccent,
              onPrimary: Colors.white,
              surface: Colors.grey[900]!,
              onSurface: Colors.white,
            ),
            textButtonTheme: TextButtonThemeData(
              style: TextButton.styleFrom(foregroundColor: Colors.deepPurpleAccent),
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null && picked != _selectedTime) {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setInt(NotificationService._keyHour, picked.hour);
      await prefs.setInt(NotificationService._keyMinute, picked.minute);

      setState(() {
        _selectedTime = picked;
      });

      if (_notificationsEnabled) {
        await _notificationService.scheduleDailyNotification();
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Daily notification scheduled for ${_selectedTime.format(context)}'),
          backgroundColor: Colors.deepPurple,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _showPermissionDeniedSnackbar() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Notification permission is required to receive daily mission reminders.'),
        action: SnackBarAction(
          label: 'SETTINGS',
          textColor: Colors.amberAccent,
          onPressed: () {
            // Can open app settings here using app_settings or similar packages
          },
        ),
        backgroundColor: Colors.redAccent,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F0E17) : const Color(0xFFF9F9FB),
      appBar: AppBar(
        title: const Text(
          'Daily Reminders',
          style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 0.5),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.deepPurple, Colors.indigo],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 10),
              // Premium banner card
              _buildGradientBanner(isDark),
              const SizedBox(height: 25),
              
              _buildSectionTitle('General Settings'),
              const SizedBox(height: 10),
              
              // Enable/Disable Card
              _buildSettingsCard(
                child: SwitchListTile(
                  value: _notificationsEnabled,
                  onChanged: _toggleNotifications,
                  title: const Text(
                    'Daily Mission Reminders',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: const Text('Receive a notification every day to complete your missions'),
                  activeColor: Colors.deepPurpleAccent,
                  secondary: CircleAvatar(
                    backgroundColor: Colors.deepPurple.withOpacity(0.1),
                    child: const Icon(Icons.notifications_active, color: Colors.deepPurple),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              
              if (_notificationsEnabled) ...[
                _buildSectionTitle('Schedule & Sound'),
                const SizedBox(height: 10),
                
                // Time selection card
                _buildSettingsCard(
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Colors.orange.withOpacity(0.1),
                      child: const Icon(Icons.access_time_rounded, color: Colors.orange),
                    ),
                    title: const Text(
                      'Reminder Time',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text('Notification will trigger at ${_selectedTime.format(context)}'),
                    trailing: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.deepPurple.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text(
                        'Change',
                        style: TextStyle(
                          color: Colors.deepPurple,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    onTap: () => _selectTime(context),
                  ),
                ),
                const SizedBox(height: 15),

                // Sound selection card
                _buildSettingsCard(
                  child: Column(
                    children: [
                      ListTile(
                        leading: CircleAvatar(
                          backgroundColor: Colors.blue.withOpacity(0.1),
                          child: const Icon(Icons.library_music_rounded, color: Colors.blue),
                        ),
                        title: const Text(
                          'Notification Music',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(
                          _soundName,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: _soundPath != null ? Colors.deepPurpleAccent : null,
                            fontWeight: _soundPath != null ? FontWeight.w500 : null,
                          ),
                        ),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if (_soundPath != null)
                              IconButton(
                                icon: const Icon(Icons.refresh_rounded, color: Colors.grey),
                                tooltip: 'Reset to default',
                                onPressed: _resetToDefaultSound,
                              ),
                            IconButton(
                              icon: const Icon(Icons.folder_open_rounded, color: Colors.deepPurple),
                              tooltip: 'Browse device music',
                              onPressed: _pickCustomSound,
                            ),
                          ],
                        ),
                      ),
                      if (Platform.isIOS && _soundPath != null)
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                          child: Row(
                            children: const [
                              Icon(Icons.info_outline, size: 16, color: Colors.amber),
                              SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  'iOS custom sounds must be pre-bundled in the app; fallback to default sound may occur.',
                                  style: TextStyle(fontSize: 12, color: Colors.amber),
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ],
              const SizedBox(height: 30),
              
              // Permission Info Card
              _buildPermissionInfoCard(isDark),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGradientBanner(bool isDark) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: const LinearGradient(
          colors: [Colors.indigo, Colors.deepPurpleAccent],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.deepPurpleAccent.withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'Daily Mission Alarm',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Keep your daily streak alive! Set a dynamic custom ringtone to wake up to your missions every day.',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 13,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 15),
          const Icon(
            Icons.military_tech_rounded,
            size: 60,
            color: Colors.amberAccent,
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.bold,
        letterSpacing: 0.5,
        color: Colors.grey,
      ),
    );
  }

  Widget _buildSettingsCard({required Widget child}) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF161522) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.2 : 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: child,
    );
  }

  Widget _buildPermissionInfoCard(bool isDark) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _permissionGranted
            ? Colors.green.withOpacity(0.08)
            : Colors.amber.withOpacity(0.08),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: _permissionGranted
              ? Colors.green.withOpacity(0.3)
              : Colors.amber.withOpacity(0.3),
        ),
      ),
      child: Row(
        children: [
          Icon(
            _permissionGranted ? Icons.check_circle_rounded : Icons.warning_amber_rounded,
            color: _permissionGranted ? Colors.green : Colors.amber,
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _permissionGranted
                      ? 'Notification permission is Active'
                      : 'Notification permission is Pending',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: _permissionGranted ? Colors.green[700] : Colors.amber[800],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _permissionGranted
                      ? 'The app is fully configured to push reminders daily.'
                      : 'Tap enable above to grant permission to push daily alarms.',
                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
