import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
    paddingBottom: 20,
    borderBottom: '1 solid #E5E7EB',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  contact: {
    fontSize: 9,
    color: '#9CA3AF',
    lineHeight: 1.8,
  },
  section: {
    marginTop: 22,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottom: '1 solid #E5E7EB',
    paddingBottom: 4,
  },
  item: {
    marginBottom: 16,
  },
  itemRow: {
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
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  itemDescription: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  skill: {
    fontSize: 9,
    color: '#4B5563',
    marginRight: 12,
    marginBottom: 4,
  },
});

const ModernTemplate = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>Alexandra Chen</Text>
        <Text style={styles.title}>Data Scientist & Machine Learning Engineer</Text>
        <Text style={styles.contact}>
          alexandra.chen@email.com • (555) 234-5678 • linkedin.com/in/alexandrachen • github.com/alexchen
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.itemDescription}>
          Data scientist with expertise in machine learning, statistical analysis, and big data technologies. 
          Passionate about turning complex data into actionable insights and building predictive models 
          that drive business decisions.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <View style={styles.item}>
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>Senior Data Scientist</Text>
            <Text style={styles.itemDate}>2021 - Present</Text>
          </View>
          <Text style={styles.itemSubtitle}>DataTech Solutions | New York, NY</Text>
          <Text style={styles.itemDescription}>
            • Developed ML models improving customer retention by 25%{'\n'}
            • Built real-time recommendation system processing 10M+ events daily{'\n'}
            • Led team of 3 junior data scientists and established best practices{'\n'}
            • Created automated pipelines reducing model deployment time by 70%
          </Text>
        </View>
        <View style={styles.item}>
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>Data Scientist</Text>
            <Text style={styles.itemDate}>2019 - 2021</Text>
          </View>
          <Text style={styles.itemSubtitle}>Analytics Corp | Boston, MA</Text>
          <Text style={styles.itemDescription}>
            • Analyzed large datasets using Python, SQL, and Spark{'\n'}
            • Built predictive models for sales forecasting{'\n'}
            • Presented findings to executive team and stakeholders
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        <View style={styles.item}>
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>Master of Science in Data Science</Text>
            <Text style={styles.itemDate}>2017 - 2019</Text>
          </View>
          <Text style={styles.itemSubtitle}>Tech University | GPA: 3.9/4.0</Text>
        </View>
        <View style={styles.item}>
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>Bachelor of Science in Statistics</Text>
            <Text style={styles.itemDate}>2013 - 2017</Text>
          </View>
          <Text style={styles.itemSubtitle}>State University</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        <View style={styles.skillsContainer}>
          <Text style={styles.skill}>Python</Text>
          <Text style={styles.skill}>R</Text>
          <Text style={styles.skill}>SQL</Text>
          <Text style={styles.skill}>TensorFlow</Text>
          <Text style={styles.skill}>PyTorch</Text>
          <Text style={styles.skill}>Scikit-learn</Text>
          <Text style={styles.skill}>Pandas</Text>
          <Text style={styles.skill}>Spark</Text>
          <Text style={styles.skill}>AWS</Text>
          <Text style={styles.skill}>Docker</Text>
          <Text style={styles.skill}>Kubernetes</Text>
          <Text style={styles.skill}>Tableau</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ModernTemplate;
