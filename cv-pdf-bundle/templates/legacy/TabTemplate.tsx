import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { CVData } from '../../types/cv';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottom: '3 solid #3B82F6',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#475569',
    marginTop: 8,
  },
  section: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 12,
    paddingBottom: 5,
    borderBottom: '2 solid #E2E8F0',
  },
  item: {
    marginBottom: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  itemDate: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.6,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skill: {
    backgroundColor: '#EFF6FF',
    color: '#1E40AF',
    padding: '4 10',
    marginRight: 8,
    marginBottom: 6,
    fontSize: 10,
    borderRadius: 4,
  },
});

interface TabTemplateProps {
  data?: CVData;
}

const TabTemplate = ({ data }: TabTemplateProps) => {
  const personalInfo = data?.personalInfo || {
    name: "John Doe",
    title: "Senior Software Engineer",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
  };

  const summary = data?.summary || "Experienced software engineer with expertise in full-stack development, cloud architecture, and team leadership.";

  const experience = data?.experience || [];
  const education = data?.education || [];
  const skills = data?.skills || { languages: [], frameworks: [], tools: [] };

  return (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{personalInfo.name}</Text>
        <Text style={styles.title}>{personalInfo.title}</Text>
        <View style={styles.contactRow}>
          <Text>{personalInfo.email}</Text>
          <Text>{personalInfo.phone}</Text>
          {personalInfo.linkedin && <Text>{personalInfo.linkedin}</Text>}
          {personalInfo.github && <Text>{personalInfo.github}</Text>}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Summary</Text>
        <Text style={styles.itemDescription}>{summary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        {experience.map((exp, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{exp.title}</Text>
              <Text style={styles.itemDate}>{exp.startDate} - {exp.endDate}</Text>
            </View>
            <Text style={styles.itemSubtitle}>{exp.company} | {exp.location}</Text>
            <Text style={styles.itemDescription}>
              {exp.description.map((desc, i) => `• ${desc}${i < exp.description.length - 1 ? '\n' : ''}`).join('')}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {education.map((edu, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{edu.degree}</Text>
              <Text style={styles.itemDate}>{edu.startDate} - {edu.endDate}</Text>
            </View>
            <Text style={styles.itemSubtitle}>
              {edu.school}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        <View style={styles.skillsRow}>
          {skills.languages?.map((skill, index) => (
            <Text key={index} style={styles.skill}>{skill}</Text>
          ))}
          {skills.frameworks?.map((skill, index) => (
            <Text key={index} style={styles.skill}>{skill}</Text>
          ))}
          {skills.tools?.map((skill, index) => (
            <Text key={index} style={styles.skill}>{skill}</Text>
          ))}
          {skills.other?.map((skill, index) => (
            <Text key={index} style={styles.skill}>{skill}</Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
  );
};

export default TabTemplate;
