import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 35,
  },
  header: {
    marginBottom: 25,
    padding: 20,
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    color: '#E0E7FF',
    marginBottom: 12,
  },
  contact: {
    fontSize: 9,
    color: '#C7D2FE',
    lineHeight: 1.8,
  },
  section: {
    marginTop: 20,
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    width: 4,
    height: 20,
    backgroundColor: '#6366F1',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366F1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  item: {
    marginBottom: 16,
    paddingLeft: 12,
    borderLeft: '3 solid #E0E7FF',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  itemDate: {
    fontSize: 11,
    color: '#6366F1',
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.6,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skillBadge: {
    backgroundColor: '#EEF2FF',
    color: '#6366F1',
    padding: '5 12',
    marginRight: 8,
    marginBottom: 8,
    fontSize: 9,
    borderRadius: 12,
    fontWeight: 'bold',
  },
});

const CreativeTemplate = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>Sarah Martinez</Text>
        <Text style={styles.title}>Creative Director & Brand Strategist</Text>
        <Text style={styles.contact}>
          sarah.martinez@email.com • (555) 456-7890 • sarahmartinez.com • @sarahmartinez
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>About</Text>
        </View>
        <Text style={styles.itemDescription}>
          Creative professional with a passion for storytelling and brand development. 
          Specialized in creating compelling visual narratives that connect brands with their audiences. 
          Experienced in leading creative teams and managing multi-channel campaigns.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Experience</Text>
        </View>
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Creative Director</Text>
            <Text style={styles.itemDate}>2020 - Present</Text>
          </View>
          <Text style={styles.itemSubtitle}>Creative Agency | Los Angeles, CA</Text>
          <Text style={styles.itemDescription}>
            • Lead creative direction for Fortune 500 clients across digital and print media{'\n'}
            • Managed team of 8 designers, copywriters, and art directors{'\n'}
            • Developed brand identities and marketing campaigns increasing client engagement by 45%{'\n'}
            • Won 3 industry awards for creative excellence
          </Text>
        </View>
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Senior Art Director</Text>
            <Text style={styles.itemDate}>2017 - 2020</Text>
          </View>
          <Text style={styles.itemSubtitle}>Design Studio | Los Angeles, CA</Text>
          <Text style={styles.itemDescription}>
            • Created visual concepts and designs for advertising campaigns{'\n'}
            • Collaborated with clients to develop brand strategies{'\n'}
            • Mentored junior designers and provided creative feedback
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Education</Text>
        </View>
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Bachelor of Fine Arts in Graphic Design</Text>
            <Text style={styles.itemDate}>2013 - 2017</Text>
          </View>
          <Text style={styles.itemSubtitle}>Art Institute | Magna Cum Laude</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Skills</Text>
        </View>
        <View style={styles.skillsGrid}>
          <Text style={styles.skillBadge}>Adobe Creative Suite</Text>
          <Text style={styles.skillBadge}>Figma</Text>
          <Text style={styles.skillBadge}>Brand Strategy</Text>
          <Text style={styles.skillBadge}>Art Direction</Text>
          <Text style={styles.skillBadge}>UI/UX Design</Text>
          <Text style={styles.skillBadge}>Typography</Text>
          <Text style={styles.skillBadge}>Photography</Text>
          <Text style={styles.skillBadge}>Video Editing</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default CreativeTemplate;
