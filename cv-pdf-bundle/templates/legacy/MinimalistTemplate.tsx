import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 60,
  },
  header: {
    marginBottom: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: 3,
  },
  title: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 15,
    fontWeight: 'normal',
  },
  contact: {
    fontSize: 8,
    color: '#999999',
    lineHeight: 2,
  },
  section: {
    marginTop: 25,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9,
    color: '#000000',
    marginBottom: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  item: {
    marginBottom: 18,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  itemTitle: {
    fontSize: 10,
    color: '#000000',
    fontWeight: 'normal',
  },
  itemDate: {
    fontSize: 9,
    color: '#999999',
  },
  itemSubtitle: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 8,
    color: '#333333',
    lineHeight: 1.5,
    paddingLeft: 0,
  },
  divider: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#E5E5E5',
    marginTop: 5,
    marginBottom: 15,
  },
  skills: {
    fontSize: 8,
    color: '#333333',
    lineHeight: 1.8,
  },
});

const MinimalistTemplate = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>David Kim</Text>
        <Text style={styles.title}>Software Architect</Text>
        <Text style={styles.contact}>
          david.kim@email.com{'\n'}
          (555) 567-8901{'\n'}
          davidkim.dev
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <View style={styles.item}>
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>Software Architect</Text>
            <Text style={styles.itemDate}>2020 - Present</Text>
          </View>
          <Text style={styles.itemSubtitle}>Tech Innovations | Seattle, WA</Text>
          <Text style={styles.itemDescription}>
            Design and implement scalable software architectures. Lead technical decisions 
            for platform development. Mentor engineering teams and establish best practices.
          </Text>
        </View>
        <View style={styles.item}>
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>Senior Software Engineer</Text>
            <Text style={styles.itemDate}>2017 - 2020</Text>
          </View>
          <Text style={styles.itemSubtitle}>Cloud Systems Inc. | Seattle, WA</Text>
          <Text style={styles.itemDescription}>
            Developed distributed systems and microservices. Optimized performance and 
            reliability. Collaborated on system design and architecture.
          </Text>
        </View>
        <View style={styles.item}>
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>Software Engineer</Text>
            <Text style={styles.itemDate}>2015 - 2017</Text>
          </View>
          <Text style={styles.itemSubtitle}>StartupCo | Remote</Text>
          <Text style={styles.itemDescription}>
            Built web applications and APIs. Participated in full development lifecycle.
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        <View style={styles.item}>
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>Master of Science in Computer Science</Text>
            <Text style={styles.itemDate}>2013 - 2015</Text>
          </View>
          <Text style={styles.itemSubtitle}>University of Technology</Text>
        </View>
        <View style={styles.item}>
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>Bachelor of Science in Computer Science</Text>
            <Text style={styles.itemDate}>2009 - 2013</Text>
          </View>
          <Text style={styles.itemSubtitle}>State University</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.skills}>
          System Design, Distributed Systems, Microservices, Cloud Architecture, 
          Java, Go, Python, Kubernetes, Docker, AWS, GCP, Database Design
        </Text>
      </View>
    </Page>
  </Document>
);

export default MinimalistTemplate;
