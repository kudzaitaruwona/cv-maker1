import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#1E293B',
    color: '#FFFFFF',
    padding: 25,
  },
  main: {
    width: '70%',
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 13,
    color: '#CBD5E1',
    marginBottom: 25,
    lineHeight: 1.5,
  },
  sidebarSection: {
    marginBottom: 25,
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
    borderBottom: '1 solid #475569',
    paddingBottom: 5,
  },
  sidebarText: {
    fontSize: 10,
    color: '#CBD5E1',
    lineHeight: 1.6,
    marginBottom: 6,
  },
  sidebarSkill: {
    fontSize: 10,
    color: '#CBD5E1',
    marginBottom: 4,
    paddingLeft: 8,
  },
  mainSection: {
    marginBottom: 22,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
    borderBottom: '2 solid #1E293B',
    paddingBottom: 5,
  },
  item: {
    marginBottom: 18,
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
    color: '#64748B',
    fontStyle: 'italic',
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.5,
  },
  summaryText: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.6,
  },
});

const ProfessionalTemplate = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.sidebar}>
        <Text style={styles.name}>Jane Smith</Text>
        <Text style={styles.title}>Product Designer & UX Strategist</Text>

        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Contact</Text>
          <Text style={styles.sidebarText}>jane.smith@email.com</Text>
          <Text style={styles.sidebarText}>(555) 987-6543</Text>
          <Text style={styles.sidebarText}>janesmith.design</Text>
          <Text style={styles.sidebarText}>San Francisco, CA</Text>
        </View>

        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Skills</Text>
          <Text style={styles.sidebarSkill}>• User Research</Text>
          <Text style={styles.sidebarSkill}>• UI/UX Design</Text>
          <Text style={styles.sidebarSkill}>• Prototyping</Text>
          <Text style={styles.sidebarSkill}>• Design Systems</Text>
          <Text style={styles.sidebarSkill}>• Figma & Sketch</Text>
          <Text style={styles.sidebarSkill}>• HTML/CSS</Text>
          <Text style={styles.sidebarSkill}>• User Testing</Text>
        </View>

        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Education</Text>
          <Text style={styles.sidebarText}>BFA in Design</Text>
          <Text style={styles.sidebarText}>Design School</Text>
          <Text style={styles.sidebarText}>2016 - 2020</Text>
        </View>

        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Languages</Text>
          <Text style={styles.sidebarText}>English (Native)</Text>
          <Text style={styles.sidebarText}>Spanish (Fluent)</Text>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.mainSection}>
          <Text style={styles.mainTitle}>Professional Summary</Text>
          <Text style={styles.summaryText}>
            Creative product designer with 5+ years of experience creating intuitive user experiences 
            for web and mobile applications. Passionate about solving complex problems through 
            thoughtful design and user-centered methodologies. Proven track record of leading design 
            initiatives that improve user engagement and business metrics.
          </Text>
        </View>

        <View style={styles.mainSection}>
          <Text style={styles.mainTitle}>Professional Experience</Text>
          <View style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>Senior Product Designer</Text>
              <Text style={styles.itemDate}>2021 - Present</Text>
            </View>
            <Text style={styles.itemSubtitle}>Design Studio | San Francisco, CA</Text>
            <Text style={styles.itemDescription}>
              • Lead design for mobile and web products used by 500K+ active users{'\n'}
              • Established comprehensive design system reducing design time by 50%{'\n'}
              • Collaborated with engineering teams on implementation and design handoff{'\n'}
              • Conducted user research and usability testing to inform design decisions{'\n'}
              • Managed design projects from concept to launch
            </Text>
          </View>
          <View style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>Product Designer</Text>
              <Text style={styles.itemDate}>2020 - 2021</Text>
            </View>
            <Text style={styles.itemSubtitle}>Creative Agency | Remote</Text>
            <Text style={styles.itemDescription}>
              • Designed user interfaces for client projects across various industries{'\n'}
              • Created wireframes, prototypes, and high-fidelity designs{'\n'}
              • Conducted user research and usability testing sessions{'\n'}
              • Presented design concepts to stakeholders and clients
            </Text>
          </View>
        </View>

        <View style={styles.mainSection}>
          <Text style={styles.mainTitle}>Key Projects</Text>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>E-commerce Platform Redesign</Text>
            <Text style={styles.itemDescription}>
              Led complete redesign of checkout flow resulting in 30% increase in conversion rate 
              and improved user satisfaction scores.
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>Mobile Banking App</Text>
            <Text style={styles.itemDescription}>
              Designed intuitive mobile experience for financial transactions, focusing on security 
              and ease of use. App received 4.8/5 rating in app stores.
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default ProfessionalTemplate;
