import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 45,
  },
  header: {
    marginBottom: 35,
    paddingBottom: 20,
    borderBottom: '3 solid #1F2937',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  contact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: '#6B7280',
    marginTop: 8,
  },
  section: {
    marginTop: 22,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottom: '2 solid #1F2937',
    paddingBottom: 4,
  },
  item: {
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  itemDate: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.5,
    paddingLeft: 8,
  },
  summary: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  skill: {
    fontSize: 9,
    color: '#374151',
    marginRight: 15,
    marginBottom: 4,
  },
});

const ExecutiveTemplate = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>Robert Anderson</Text>
        <Text style={styles.title}>Chief Technology Officer</Text>
        <View style={styles.contact}>
          <Text>robert.anderson@email.com</Text>
          <Text>(555) 678-9012</Text>
          <Text>linkedin.com/in/robertanderson</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <Text style={styles.summary}>
          Seasoned technology executive with 15+ years of experience leading engineering organizations 
          and driving digital transformation. Proven track record of scaling teams, delivering innovative 
          products, and achieving business objectives through strategic technology leadership. Expertise 
          in cloud architecture, software development, and building high-performance engineering cultures.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Experience</Text>
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Chief Technology Officer</Text>
            <Text style={styles.itemDate}>2019 - Present</Text>
          </View>
          <Text style={styles.itemSubtitle}>Enterprise Solutions Group | San Francisco, CA</Text>
          <Text style={styles.itemDescription}>
            • Lead technology strategy and execution for 200+ person engineering organization{'\n'}
            • Architected cloud-native platform serving 10M+ users with 99.9% uptime{'\n'}
            • Reduced infrastructure costs by 40% through optimization and automation{'\n'}
            • Established engineering culture and processes improving delivery velocity by 60%{'\n'}
            • Led acquisition and integration of 3 technology companies
          </Text>
        </View>
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>VP of Engineering</Text>
            <Text style={styles.itemDate}>2015 - 2019</Text>
          </View>
          <Text style={styles.itemSubtitle}>TechScale Inc. | San Francisco, CA</Text>
          <Text style={styles.itemDescription}>
            • Managed engineering teams across 4 product lines{'\n'}
            • Scaled engineering organization from 30 to 120 engineers{'\n'}
            • Implemented DevOps practices reducing deployment time by 80%{'\n'}
            • Delivered 5 major product launches on schedule and within budget
          </Text>
        </View>
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Director of Engineering</Text>
            <Text style={styles.itemDate}>2012 - 2015</Text>
          </View>
          <Text style={styles.itemSubtitle}>Innovation Labs | Palo Alto, CA</Text>
          <Text style={styles.itemDescription}>
            • Led development of core platform products{'\n'}
            • Built and managed team of 25 engineers{'\n'}
            • Established agile development practices and CI/CD pipelines
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Master of Science in Computer Science</Text>
            <Text style={styles.itemDate}>2008 - 2010</Text>
          </View>
          <Text style={styles.itemSubtitle}>Stanford University</Text>
        </View>
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Bachelor of Science in Computer Engineering</Text>
            <Text style={styles.itemDate}>2004 - 2008</Text>
          </View>
          <Text style={styles.itemSubtitle}>MIT</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Core Competencies</Text>
        <View style={styles.skillsRow}>
          <Text style={styles.skill}>Strategic Planning</Text>
          <Text style={styles.skill}>Team Leadership</Text>
          <Text style={styles.skill}>Cloud Architecture</Text>
          <Text style={styles.skill}>Agile/Scrum</Text>
          <Text style={styles.skill}>Budget Management</Text>
          <Text style={styles.skill}>Vendor Relations</Text>
          <Text style={styles.skill}>M&A Integration</Text>
          <Text style={styles.skill}>Digital Transformation</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ExecutiveTemplate;
