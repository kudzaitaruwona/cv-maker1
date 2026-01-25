/**
 * Template 3: Bold Headers
 * 
 * Description: Emphasized section dividers with stronger typography.
 * Perfect for: Mid-level professionals, marketing roles, standout applications
 * 
 * Features:
 * - Thicker header fonts
 * - Subtle background bars for sections
 * - Professional but visually striking headers
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { CompleteCVForPDF } from '../../types/complete-cv';
import { formatDateRange, hasContent, sortByOrder } from '../../lib/pdf-utils';

interface ResumeTemplateProps {
  data: CompleteCVForPDF;
}

const ResumeTemplate3: React.FC<ResumeTemplateProps> = ({ data }) => {
  const styles = StyleSheet.create({
    page: {
      paddingTop: 36,
      paddingBottom: 36,
      paddingHorizontal: 40,
      fontSize: 11,
      fontFamily: 'Helvetica',
      color: '#000000',
    },
    header: {
      marginBottom: 25,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#000000',
      letterSpacing: 0.5,
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontSize: 10,
      gap: 10,
      color: '#333333',
    },
    contactItem: {
      marginRight: 10,
    },
    section: {
      marginTop: 18,
      marginBottom: 12,
      pageBreakInside: 'avoid',
    },
    sectionHeaderContainer: {
      backgroundColor: '#f0f0f0',
      padding: 8,
      marginBottom: 12,
    },
    sectionHeader: {
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: '#000000',
      letterSpacing: 1.5,
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
      color: '#000000',
    },
    itemDates: {
      fontSize: 10,
      color: '#333333',
      fontWeight: 'bold',
    },
    itemOrganization: {
      fontSize: 11,
      color: '#000000',
      marginBottom: 2,
    },
    itemLocation: {
      fontSize: 10,
      color: '#666666',
      marginBottom: 6,
    },
    bullets: {
      marginTop: 4,
    },
    bullet: {
      fontSize: 10,
      color: '#000000',
      marginBottom: 3,
      paddingLeft: 8,
    },
    summaryText: {
      fontSize: 11,
      color: '#000000',
      lineHeight: 1.5,
    },
    skillsCategory: {
      marginBottom: 8,
    },
    skillsCategoryTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#000000',
    },
    skillsList: {
      fontSize: 10,
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

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeader}>{title}</Text>
    </View>
  );

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
            <SectionHeader title="SUMMARY" />
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {hasContent(data.sections.experience) && (
          <View style={styles.section}>
            <SectionHeader title="EXPERIENCE" />
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
            <SectionHeader title="PROJECTS" />
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
            <SectionHeader title="EDUCATION" />
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
            <SectionHeader title="SKILLS" />
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
            <SectionHeader title="CERTIFICATIONS" />
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
            <SectionHeader title="OTHER" />
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

export default ResumeTemplate3;
