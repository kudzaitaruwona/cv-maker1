/**
 * Template 6: Timeline Style
 * 
 * Description: Dates prominently displayed on left, visual flow emphasizing career progression.
 * Perfect for: Career changers, professionals with clear progression, chronological emphasis
 * 
 * Features:
 * - Dates on left side
 * - Chronological emphasis
 * - Visual flow
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { CompleteCVForPDF } from '../../types/complete-cv';
import { formatDateRange, hasContent, sortByOrder } from '../../lib/pdf-utils';

interface ResumeTemplateProps {
  data: CompleteCVForPDF;
}

const ResumeTemplate6: React.FC<ResumeTemplateProps> = ({ data }) => {
  const styles = StyleSheet.create({
    page: {
      paddingTop: 32,
      paddingBottom: 32,
      paddingHorizontal: 36,
      fontSize: 10,
      fontFamily: 'Helvetica',
      color: '#000000',
    },
    header: {
      marginBottom: 18,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#000000',
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontSize: 9,
      gap: 10,
      color: '#333333',
    },
    contactItem: {
      marginRight: 10,
    },
    section: {
      marginTop: 16,
      marginBottom: 12,
      pageBreakInside: 'avoid',
    },
    sectionHeader: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 12,
      textTransform: 'uppercase',
      color: '#000000',
    },
    item: {
      flexDirection: 'row',
      marginBottom: 14,
    },
    dateColumn: {
      width: '25%',
      paddingRight: 15,
    },
    contentColumn: {
      width: '75%',
    },
    itemDates: {
      fontSize: 9,
      color: '#333333',
      fontWeight: 'bold',
    },
    itemTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 3,
    },
    itemOrganization: {
      fontSize: 10,
      color: '#000000',
      marginBottom: 2,
    },
    itemLocation: {
      fontSize: 9,
      color: '#666666',
      marginBottom: 6,
    },
    bullets: {
      marginTop: 4,
    },
    bullet: {
      fontSize: 9,
      color: '#000000',
      marginBottom: 3,
      paddingLeft: 8,
    },
    summaryText: {
      fontSize: 10,
      color: '#000000',
      lineHeight: 1.5,
    },
    skillsCategory: {
      marginBottom: 8,
    },
    skillsCategoryTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#000000',
    },
    skillsList: {
      fontSize: 9,
      color: '#000000',
      lineHeight: 1.4,
    },
  });

  const sortedExperience = sortByOrder(data.sections.experience);
  const sortedProjects = sortByOrder(data.sections.projects);
  const sortedEducation = sortByOrder(data.sections.education);
  const sortedSkills = sortByOrder(data.sections.skills);
  const sortedCertifications = sortByOrder(data.sections.certifications);
  const sortedOther = sortByOrder(data.sections.other);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.header.full_name}</Text>
          <View style={styles.contactInfo}>
            {data.header.email && <Text style={styles.contactItem}>{data.header.email}</Text>}
            {data.header.phone && <Text style={styles.contactItem}>{data.header.phone}</Text>}
            {data.header.location && <Text style={styles.contactItem}>{data.header.location}</Text>}
            {data.header.linkedin_url && (
              <Link src={data.header.linkedin_url} style={styles.contactItem}>
                <Text>{data.header.linkedin_url}</Text>
              </Link>
            )}
            {data.header.github_url && (
              <Link src={data.header.github_url} style={styles.contactItem}>
                <Text>{data.header.github_url}</Text>
              </Link>
            )}
            {data.header.portfolio_url && (
              <Link src={data.header.portfolio_url} style={styles.contactItem}>
                <Text>{data.header.portfolio_url}</Text>
              </Link>
            )}
          </View>
        </View>

        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>SUMMARY</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {hasContent(data.sections.experience) && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>EXPERIENCE</Text>
            {sortedExperience.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <View style={styles.dateColumn}>
                  {exp.start_date && (
                    <Text style={styles.itemDates}>
                      {formatDateRange(exp.start_date, exp.end_date)}
                    </Text>
                  )}
                </View>
                <View style={styles.contentColumn}>
                  <Text style={styles.itemTitle}>{exp.title}</Text>
                  {exp.organization && <Text style={styles.itemOrganization}>{exp.organization}</Text>}
                  {exp.location && <Text style={styles.itemLocation}>{exp.location}</Text>}
                  {hasContent(exp.bullets) && (
                    <View style={styles.bullets}>
                      {sortByOrder(exp.bullets).map((bullet) => (
                        <Text key={bullet.id} style={styles.bullet}>• {bullet.content}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {hasContent(data.sections.projects) && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>PROJECTS</Text>
            {sortedProjects.map((project) => (
              <View key={project.id} style={styles.item}>
                <View style={styles.dateColumn}>
                  {project.start_date && (
                    <Text style={styles.itemDates}>
                      {formatDateRange(project.start_date, project.end_date)}
                    </Text>
                  )}
                </View>
                <View style={styles.contentColumn}>
                  <Text style={styles.itemTitle}>{project.title}</Text>
                  {project.organization && <Text style={styles.itemOrganization}>{project.organization}</Text>}
                  {project.link && (
                    <Link src={project.link}>
                      <Text style={styles.itemLocation}>{project.link}</Text>
                    </Link>
                  )}
                  {hasContent(project.bullets) && (
                    <View style={styles.bullets}>
                      {sortByOrder(project.bullets).map((bullet) => (
                        <Text key={bullet.id} style={styles.bullet}>• {bullet.content}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {hasContent(data.sections.education) && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>EDUCATION</Text>
            {sortedEducation.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <View style={styles.dateColumn}>
                  {edu.start_date && (
                    <Text style={styles.itemDates}>
                      {formatDateRange(edu.start_date, edu.end_date)}
                    </Text>
                  )}
                </View>
                <View style={styles.contentColumn}>
                  <Text style={styles.itemTitle}>{edu.title}</Text>
                  {edu.organization && <Text style={styles.itemOrganization}>{edu.organization}</Text>}
                  {edu.location && <Text style={styles.itemLocation}>{edu.location}</Text>}
                  {hasContent(edu.bullets) && (
                    <View style={styles.bullets}>
                      {sortByOrder(edu.bullets).map((bullet) => (
                        <Text key={bullet.id} style={styles.bullet}>• {bullet.content}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {hasContent(data.sections.skills) && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>SKILLS</Text>
            {sortedSkills.map((skill) => (
              <View key={skill.id} style={styles.skillsCategory}>
                <Text style={styles.skillsCategoryTitle}>{skill.title}</Text>
                {hasContent(skill.bullets) && (
                  <Text style={styles.skillsList}>
                    {sortByOrder(skill.bullets).map(b => b.content).join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {hasContent(data.sections.certifications) && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>CERTIFICATIONS</Text>
            {sortedCertifications.map((cert) => (
              <View key={cert.id} style={styles.item}>
                <View style={styles.dateColumn}>
                  {cert.start_date && (
                    <Text style={styles.itemDates}>
                      {formatDateRange(cert.start_date, cert.end_date)}
                    </Text>
                  )}
                </View>
                <View style={styles.contentColumn}>
                  <Text style={styles.itemTitle}>{cert.title}</Text>
                  {cert.organization && <Text style={styles.itemOrganization}>{cert.organization}</Text>}
                  {cert.link && (
                    <Link src={cert.link}>
                      <Text style={styles.itemLocation}>{cert.link}</Text>
                    </Link>
                  )}
                  {hasContent(cert.bullets) && (
                    <View style={styles.bullets}>
                      {sortByOrder(cert.bullets).map((bullet) => (
                        <Text key={bullet.id} style={styles.bullet}>• {bullet.content}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {hasContent(data.sections.other) && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>OTHER</Text>
            {sortedOther.map((item) => (
              <View key={item.id} style={styles.item}>
                <View style={styles.dateColumn}>
                  {item.start_date && (
                    <Text style={styles.itemDates}>
                      {formatDateRange(item.start_date, item.end_date)}
                    </Text>
                  )}
                </View>
                <View style={styles.contentColumn}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.organization && <Text style={styles.itemOrganization}>{item.organization}</Text>}
                  {item.location && <Text style={styles.itemLocation}>{item.location}</Text>}
                  {item.link && (
                    <Link src={item.link}>
                      <Text style={styles.itemLocation}>{item.link}</Text>
                    </Link>
                  )}
                  {hasContent(item.bullets) && (
                    <View style={styles.bullets}>
                      {sortByOrder(item.bullets).map((bullet) => (
                        <Text key={bullet.id} style={styles.bullet}>• {bullet.content}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumeTemplate6;
