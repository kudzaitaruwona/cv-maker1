/**
 * Template 5: Left Sidebar
 * 
 * Description: Contact info and skills in narrow left column, main content on right.
 * Perfect for: Tech professionals, designers, roles emphasizing skills
 * 
 * Features:
 * - Narrow left sidebar (25% width)
 * - Main content area (75% width)
 * - ATS-parseable as single column
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { CompleteCVForPDF } from '../../types/complete-cv';
import { formatDateRange, hasContent, sortByOrder } from '../../lib/pdf-utils';

interface ResumeTemplateProps {
  data: CompleteCVForPDF;
}

const ResumeTemplate5: React.FC<ResumeTemplateProps> = ({ data }) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      paddingTop: 32,
      paddingBottom: 32,
      paddingHorizontal: 32,
      fontSize: 10,
      fontFamily: 'Helvetica',
      color: '#000000',
    },
    sidebar: {
      width: '30%',
      backgroundColor: '#f8f8f8',
      padding: 25,
    },
    main: {
      width: '70%',
      padding: 30,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#000000',
    },
    sidebarSection: {
      marginBottom: 20,
    },
    sidebarTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      marginBottom: 8,
      textTransform: 'uppercase',
      color: '#000000',
      borderBottom: '1 solid #000000',
      paddingBottom: 4,
    },
    sidebarText: {
      fontSize: 9,
      color: '#000000',
      lineHeight: 1.5,
      marginBottom: 4,
    },
    sidebarLink: {
      fontSize: 9,
      color: '#0066cc',
      lineHeight: 1.5,
      marginBottom: 4,
    },
    skillsCategory: {
      marginBottom: 10,
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
    section: {
      marginTop: 16,
      marginBottom: 12,
      pageBreakInside: 'avoid',
    },
    sectionHeader: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 10,
      textTransform: 'uppercase',
      color: '#000000',
      borderBottom: '1 solid #000000',
      paddingBottom: 4,
    },
    item: {
      marginBottom: 14,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
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
        <View style={styles.sidebar}>
          <Text style={styles.name}>{data.header.full_name}</Text>
          
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Contact</Text>
            {data.header.email && <Text style={styles.sidebarText}>{data.header.email}</Text>}
            {data.header.phone && <Text style={styles.sidebarText}>{data.header.phone}</Text>}
            {data.header.location && <Text style={styles.sidebarText}>{data.header.location}</Text>}
            {data.header.linkedin_url && (
              <Link src={data.header.linkedin_url}>
                <Text style={styles.sidebarLink}>{data.header.linkedin_url}</Text>
              </Link>
            )}
            {data.header.github_url && (
              <Link src={data.header.github_url}>
                <Text style={styles.sidebarLink}>{data.header.github_url}</Text>
              </Link>
            )}
            {data.header.portfolio_url && (
              <Link src={data.header.portfolio_url}>
                <Text style={styles.sidebarLink}>{data.header.portfolio_url}</Text>
              </Link>
            )}
          </View>

          {hasContent(data.sections.skills) && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Skills</Text>
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
        </View>

        <View style={styles.main}>
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
        </View>
      </Page>
    </Document>
  );
};

export default ResumeTemplate5;
