/**
 * Template 4: Compact Efficient
 * 
 * Description: Maximizes content while maintaining readability.
 * Perfect for: Extensive experience, 2-page resumes, detailed backgrounds
 * 
 * Features:
 * - Tighter spacing, smaller margins
 * - Efficient use of space
 * - Good for extensive experience
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { CompleteCVForPDF } from '../../types/complete-cv';
import { formatDateRange, hasContent, sortByOrder } from '../../lib/pdf-utils';

interface ResumeTemplateProps {
  data: CompleteCVForPDF;
}

const ResumeTemplate4: React.FC<ResumeTemplateProps> = ({ data }) => {
  const styles = StyleSheet.create({
    page: {
      paddingTop: 28,
      paddingBottom: 28,
      paddingHorizontal: 32,
      fontSize: 10,
      fontFamily: 'Helvetica',
      color: '#000000',
    },
    header: {
      marginBottom: 12,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 6,
      color: '#000000',
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontSize: 9,
      gap: 8,
      color: '#333333',
    },
    contactItem: {
      marginRight: 8,
    },
    section: {
      marginTop: 10,
      marginBottom: 8,
      pageBreakInside: 'avoid',
    },
    sectionHeader: {
      fontSize: 11,
      fontWeight: 'bold',
      marginBottom: 8,
      textTransform: 'uppercase',
      color: '#000000',
    },
    item: {
      marginBottom: 10,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    itemTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#000000',
    },
    itemDates: {
      fontSize: 9,
      color: '#333333',
    },
    itemOrganization: {
      fontSize: 10,
      color: '#000000',
      marginBottom: 1,
    },
    itemLocation: {
      fontSize: 9,
      color: '#666666',
      marginBottom: 4,
    },
    bullets: {
      marginTop: 2,
    },
    bullet: {
      fontSize: 9,
      color: '#000000',
      marginBottom: 2,
      paddingLeft: 6,
      lineHeight: 1.3,
    },
    summaryText: {
      fontSize: 10,
      color: '#000000',
      lineHeight: 1.4,
    },
    skillsCategory: {
      marginBottom: 6,
    },
    skillsCategoryTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 2,
      color: '#000000',
    },
    skillsList: {
      fontSize: 9,
      color: '#000000',
      lineHeight: 1.3,
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
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.title}</Text>
                  {exp.start_date && (
                    <Text style={styles.itemDates}>
                      {formatDateRange(exp.start_date, exp.end_date)}
                    </Text>
                  )}
                </View>
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
            ))}
          </View>
        )}

        {hasContent(data.sections.projects) && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>PROJECTS</Text>
            {sortedProjects.map((project) => (
              <View key={project.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{project.title}</Text>
                  {project.start_date && (
                    <Text style={styles.itemDates}>
                      {formatDateRange(project.start_date, project.end_date)}
                    </Text>
                  )}
                </View>
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
            ))}
          </View>
        )}

        {hasContent(data.sections.education) && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>EDUCATION</Text>
            {sortedEducation.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.title}</Text>
                  {edu.start_date && (
                    <Text style={styles.itemDates}>
                      {formatDateRange(edu.start_date, edu.end_date)}
                    </Text>
                  )}
                </View>
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
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{cert.title}</Text>
                  {cert.start_date && (
                    <Text style={styles.itemDates}>
                      {formatDateRange(cert.start_date, cert.end_date)}
                    </Text>
                  )}
                </View>
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
            ))}
          </View>
        )}

        {hasContent(data.sections.other) && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>OTHER</Text>
            {sortedOther.map((item) => (
              <View key={item.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.start_date && (
                    <Text style={styles.itemDates}>
                      {formatDateRange(item.start_date, item.end_date)}
                    </Text>
                  )}
                </View>
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
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumeTemplate4;
