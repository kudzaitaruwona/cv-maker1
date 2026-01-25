/**
 * Template 2: Modern Minimal
 * 
 * Description: Clean lines, generous white space with one subtle accent color.
 * Perfect for: Tech roles, startups, creative industries
 * 
 * Features:
 * - Generous padding and margins
 * - Subtle dark blue/gray accent for headers
 * - Contemporary but conservative design
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { CompleteCVForPDF } from '../../types/complete-cv';
import { formatDateRange, hasContent, sortByOrder } from '../../lib/pdf-utils';

interface ResumeTemplateProps {
  data: CompleteCVForPDF;
}

const ResumeTemplate2: React.FC<ResumeTemplateProps> = ({ data }) => {
  const styles = StyleSheet.create({
    page: {
      paddingTop: 36,
      paddingBottom: 36,
      paddingHorizontal: 40,
      fontSize: 11,
      fontFamily: 'Helvetica',
      color: '#1a1a1a',
    },
    header: {
      marginBottom: 30,
      textAlign: 'center',
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#1a1a1a',
      letterSpacing: 0.5,
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontSize: 9,
      justifyContent: 'center',
      gap: 12,
      color: '#4a5568',
    },
    contactItem: {
      marginRight: 8,
    },
    section: {
      marginTop: 18,
      marginBottom: 12,
      pageBreakInside: 'avoid',
    },
    sectionHeader: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 12,
      textTransform: 'uppercase',
      color: '#2d3748',
      letterSpacing: 1,
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
      fontSize: 12,
      fontWeight: 'bold',
      color: '#1a1a1a',
    },
    itemDates: {
      fontSize: 10,
      color: '#4a5568',
    },
    itemOrganization: {
      fontSize: 11,
      color: '#2d3748',
      marginBottom: 2,
    },
    itemLocation: {
      fontSize: 10,
      color: '#718096',
      marginBottom: 8,
    },
    bullets: {
      marginTop: 6,
    },
    bullet: {
      fontSize: 10,
      color: '#1a1a1a',
      marginBottom: 4,
      paddingLeft: 10,
      lineHeight: 1.5,
    },
    summaryText: {
      fontSize: 11,
      color: '#1a1a1a',
      lineHeight: 1.6,
      textAlign: 'left',
    },
    skillsCategory: {
      marginBottom: 10,
    },
    skillsCategoryTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#2d3748',
    },
    skillsList: {
      fontSize: 10,
      color: '#1a1a1a',
      lineHeight: 1.5,
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

export default ResumeTemplate2;
