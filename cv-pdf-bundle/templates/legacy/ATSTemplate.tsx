import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { CVData } from '../../types/cv';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 50,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 25,
    textAlign: 'left',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  contact: {
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.5,
    marginTop: 5,
  },
  section: {
    marginTop: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textTransform: 'uppercase',
    borderBottom: '1 solid #000000',
    paddingBottom: 2,
  },
  item: {
    marginBottom: 12,
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
    color: '#000000',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#000000',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  itemDescription: {
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.4,
    marginTop: 3,
  },
  bulletPoint: {
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.4,
    marginLeft: 10,
    marginBottom: 2,
  },
  summaryText: {
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.5,
    textAlign: 'left',
  },
  skillsText: {
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.5,
  },
  educationItem: {
    marginBottom: 10,
  },
});

interface ATSTemplateProps {
  data?: CVData;
}

const ATSTemplate = ({ data }: ATSTemplateProps) => {
  const personalInfo = data?.personalInfo || {
    name: "JAMES WILSON",
    title: "",
    email: "james.wilson@email.com",
    phone: "(555) 789-0123",
    location: "Austin, TX",
    linkedin: "linkedin.com/in/jameswilson",
    github: "github.com/jameswilson",
  };

  const summary = data?.summary || "Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership.";
  const experience = data?.experience || [];
  const education = data?.education || [];
  const skills = data?.skills || {};

  const contactLine = [
    `Email: ${personalInfo.email}`,
    `Phone: ${personalInfo.phone}`,
    `Location: ${personalInfo.location}`,
    personalInfo.linkedin ? `LinkedIn: ${personalInfo.linkedin}` : '',
    personalInfo.github ? `GitHub: ${personalInfo.github}` : '',
  ].filter(Boolean).join(' | ');

  const skillsText = [
    skills.languages && skills.languages.length > 0 ? `Programming Languages: ${skills.languages.join(', ')}` : '',
    skills.frameworks && skills.frameworks.length > 0 ? `Frameworks and Libraries: ${skills.frameworks.join(', ')}` : '',
    skills.tools && skills.tools.length > 0 ? `Tools and Technologies: ${skills.tools.join(', ')}` : '',
  ].filter(Boolean).join('\n');

  return (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{personalInfo.name.toUpperCase()}</Text>
        <Text style={styles.contact}>{contactLine}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Summary</Text>
        <Text style={styles.summaryText}>{summary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Experience</Text>
        {experience.map((exp, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{exp.title}</Text>
              <Text style={styles.itemDate}>{exp.startDate} - {exp.endDate}</Text>
            </View>
            <Text style={styles.itemSubtitle}>{exp.company}, {exp.location}</Text>
            {exp.description.map((desc, i) => (
              <Text key={i} style={styles.bulletPoint}>• {desc}</Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {education.map((edu, index) => (
          <View key={index} style={styles.educationItem}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{edu.degree}</Text>
              <Text style={styles.itemDate}>{edu.startDate} - {edu.endDate}</Text>
            </View>
            <Text style={styles.itemSubtitle}>{edu.school}, {edu.location}</Text>
            {edu.gpa && <Text style={styles.itemDescription}>GPA: {edu.gpa}</Text>}
          </View>
        ))}
      </View>

      {skillsText && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          <Text style={styles.skillsText}>{skillsText}</Text>
        </View>
      )}

      {data?.certifications && data.certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <Text style={styles.itemDescription}>
            {data.certifications.map(cert => 
              `${cert.name}${cert.date ? ` (${cert.date})` : ''}`
            ).join('\n')}
          </Text>
        </View>
      )}
    </Page>
  </Document>
  );
};

export default ATSTemplate;
