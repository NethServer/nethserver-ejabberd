Summary: NethServer ejabberd XMPP server
Name: nethserver-ejabberd
Version: 1.1.5
Release: 1%{?dist}
License: GPL
Source: %{name}-%{version}.tar.gz

BuildArch: noarch
BuildRequires: nethserver-devtools
BuildRequires: systemd
Requires(post): systemd
Requires(preun): systemd
Requires(postun): systemd

Requires: ejabberd = 18.06
Requires: nethserver-httpd

%description
NethServer configuration of ejabberd XMPP server

%prep
%setup

%build
%{makedocs}
perl createlinks

%install
rm -rf %{buildroot}
(cd root ; find . -depth -print | cpio -dump %{buildroot})
%{genfilelist} %{buildroot} > %{name}-%{version}-%{release}-filelist
mkdir -p %{buildroot}/%{_localstatedir}/log/ejabberd
mkdir -p %{buildroot}/%{_sysconfdir}/ejabberd
mkdir -p %{buildroot}/%{_localstatedir}/lib/ejabberd
mkdir -p %{buildroot}/%{_localstatedir}/lib/nethserver/ejabberd

%files -f %{name}-%{version}-%{release}-filelist 
%defattr(-,root,root)
%doc COPYING
%doc README.rst
%dir %{_nseventsdir}/%{name}-update
%attr(0750,ejabberd,ejabberd) %dir %{_localstatedir}/log/ejabberd
%attr(0750,ejabberd,ejabberd) %dir %{_localstatedir}/lib/ejabberd
%attr(0750,ejabberd,ejabberd) %dir %{_sysconfdir}/ejabberd
%attr(0640,ejabberd,ejabberd) %ghost %{_sysconfdir}/ejabberd/ejabberd.yml
%attr(0640,ejabberd,ejabberd) %{_sysconfdir}/ejabberd/inetrc
%attr(0750,ejabberd,ejabberd) %dir %{_localstatedir}/lib/nethserver/ejabberd

%post
%systemd_post ejabberd.service

%preun
%systemd_preun ejabberd.service

%postun
%systemd_postun


%changelog
* Mon May 22 2017 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.1.5-1
- Default userPrincipalName is not an email address - Bug NethServer/dev#5284
- Set user name as DisplayName

* Mon Mar 06 2017 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.1.4-1
- Fix access prop - NethServer/dev#5196

* Thu Dec 15 2016 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.1.3-1
- Enable LDAPs protocol on Active Directory clients - NethServer/dev#5161

* Fri Oct 14 2016 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.1.2-1
- XMPP over bosh does not work - Bug NethServer/dev#5131

* Thu Jul 21 2016 Davide Principi <davide.principi@nethesis.it> - 1.1.1-1
- Web UI: missing labels - Bug NethServer/dev#5061
- Can't install nethserver-messaging with nethserver-dc - Bug NethServer/dev#5052

* Thu Jul 07 2016 Stefano Fancello <stefano.fancello@nethesis.it> - 1.1.0-1
- First NS7 release

* Tue Sep 29 2015 Davide Principi <davide.principi@nethesis.it> - 1.0.5-1
- Make Italian language pack optional - Enhancement #3265 [NethServer]

* Tue Jul 08 2014 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.0.4-1.ns6
- DNS SRV record for XMPP protocol - Enhancement #2715
- Fix missing Italian translation - Bug #2706

* Wed Feb 05 2014 Davide Principi <davide.principi@nethesis.it> - 1.0.3-1.ns6
- Move admin user in LDAP DB - Feature #2492 [NethServer]
- Lib: synchronize service status prop and chkconfig - Feature #2067 [NethServer]
- Update all inline help documentation - Task #1780 [NethServer]

* Tue Apr 30 2013 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.0.2-1.ns6
- Rebuild for automatic package handling. #1870
- Small fixes

* Tue Mar 19 2013 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.0.1-1
- Add migration code

* Thu Jan 17 2013 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.0.0-1
- First release
