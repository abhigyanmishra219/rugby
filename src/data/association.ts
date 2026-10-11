import { AssociationInfo, CommitteeMember } from './types';

export const associationInfoData: AssociationInfo = {
  name: 'Uttarakhand Rugby Association',
  president: 'Mr. Yashwant Singh',
  generalSecretary: 'Mr. Ayush Kumar',
  treasurer: 'Mr. Himanshu Kumar',
  address: 'H N 247, Adarsh Nagar, Roorkee, Haridwar, Uttarakhand, PIN 249405',
  contacts: [
    { display: '+91 99171 34411', value: '+919917134411' },
    { display: '82794 66358', value: '+918279466358' },
  ],
  email: 'uttarakhandrugbyassociation@gmail.com',
  registrationAct: 'Society Registration Act, 1860',
  registrationNumber: 'UK06859112021007336',
  registrationDate: 'November 2021',
};

export const committeeMembersData: CommitteeMember[] = [
  {
    id: 'cm-1',
    name: 'Yashwant Singh',
    role: 'President',
    initials: 'YS',
    isExecutive: true,
  },
  {
    id: 'cm-2',
    name: 'Suryakant Saini',
    role: 'Vice President',
    initials: 'SS',
    isExecutive: true,
  },
  {
    id: 'cm-3',
    name: 'Ayush Kumar',
    role: 'General Secretary',
    initials: 'AK',
    isExecutive: true,
  },
  {
    id: 'cm-4',
    name: 'Akaash Singh',
    role: 'Joint Secretary',
    initials: 'AS',
    isExecutive: true,
  },
  {
    id: 'cm-5',
    name: 'Himanshu Kumar',
    role: 'Treasurer',
    initials: 'HK',
    isExecutive: true,
  },
  {
    id: 'cm-6',
    name: 'Himani Saini',
    role: 'Executive Member',
    initials: 'HS',
    isExecutive: false,
  },
  {
    id: 'cm-7',
    name: 'Manoj Singh Negi',
    role: 'Executive Member',
    initials: 'MN',
    isExecutive: false,
  },
];
