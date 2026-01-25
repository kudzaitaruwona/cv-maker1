import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 50,
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  divider: {
    width: 80,
    height: 2,
    backgroundColor: '#000000',
    margin: '0 auto',
    marginBottom: 10,
  },
  contact: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.8,
  },
  section: {
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    borderBottom: '1 solid #000000',
    paddingBottom: 3,
  },
  item: {
    marginBottom: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
  },
  itemDate: {
    fontSize: 10,
    color: '#333333',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 9,
    color: '#333333',
    lineHeight: 1.4,
    paddingLeft: 10,
  },
  skillsList: {
    fontSize: 9,
    color: '#333333',
    lineHeight: 1.6,
  },
});

const ClassicTemplate = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>Michael Johnson</Text>
        <View style={styles.divider} />
        <Text style={styles.contact}>
          michael.johnson@email.com | (555) 345-6789 | linkedin.com/in/michaeljohnson
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Objective</Text>
        <Text style={styles.itemDescription}>
          Seeking a challenging position as a Senior Project Manager where I can utilize my extensive 
          experience in leading cross-functional teams and delivering complex projects on time and within budget.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Experience</Text>
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Senior Project Manager</Text>
            <Text style={styles.itemDate}>2019 - Present</Text>
          </View>
          <Text style={styles.itemSubtitle}>Global Solutions Inc. | Chicago, IL</Text>
          <Text style={styles.itemDescription}>
            • Managed multiple projects simultaneously with budgets exceeding $2M{'\n'}
            • Led cross-functional teams of 15+ members across different time zones{'\n'}
            • Implemented Agile methodologies improving project delivery time by 35%{'\n'}
            • Successfully delivered 20+ projects on time and within budget
          </Text>
        </View>
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Project Manager</Text>
            <Text style={styles.itemDate}>2016 - 2019</Text>
          </View>
          <Text style={styles.itemSubtitle}>Tech Solutions LLC | Chicago, IL</Text>
          <Text style={styles.itemDescription}>
            • Planned and executed software development projects{'\n'}
            • Coordinated with stakeholders and managed project timelines{'\n'}
            • Created project documentation and status reports
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Master of Business Administration</Text>
            <Text style={styles.itemDate}>2014 - 2016</Text>
          </View>
          <Text style={styles.itemSubtitle}>Business School | Concentration in Project Management</Text>
        </View>
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Bachelor of Science in Engineering</Text>
            <Text style={styles.itemDate}>2010 - 2014</Text>
          </View>
          <Text style={styles.itemSubtitle}>State University</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.skillsList}>
          Project Management, Agile/Scrum, Risk Management, Budget Planning, Team Leadership, 
          Stakeholder Management, Microsoft Project, Jira, Confluence, PMP Certified
        </Text>
      </View>
    </Page>
  </Document>
);

export default ClassicTemplate;
