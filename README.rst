===================
nethserver-ejabberd
===================

The chat function is implemented using ejabberd XMPP server. Enabled features are:

* LDAP based roster
* SSL/TLS
* Admin group

If you want to give admin permissions to an existing user, just add the user to the special group ``jabberadmins``.
The ``jabberadmins`` must be created manually.

If the system has a remote account provider also reconfigure the ejabberd service:

::

    sss_cache -g jabberadmins
    signal-event nethserver-ejabberd-save

When used with AD backend, following limitations apply:

* The shared roster doesn't support groups
* The shared roster displays the list of user names (not full names)

See also the Server Manager UI API documentation: https://github.com/NethServer/nethserver-ejabberd/blob/master/UI-API.md

Configuration
=============

Properties:

* *WebAdmin*: Enable ejabberd built-in web interface. Can be ``enabled`` or ``disabled``, default is ``disabled``
* *S2S*: Enable the server-to-server (S2S) for XMPP Federation (Port number: 5269). Can be ``enabled``, default is ``disabled``
* *ModMamStatus*: The XEP-0313: Message Archive Management (mod_mam). Can be ``enabled``, default is ``disabled``
* *ModMamPurgeDBStatus*: Purge the Mnesia database of old messages of mod_mam
* *ModMamPurgeDBInterval*: Remove messages older than X days, default is ``30``
* *ShaperFast*: Download speed limit in bytes/second for admin users, default is ``1000000``
* *ShaperNormal*: Download speed limit in bytes/second for users, default is ``500000``

When enabled, web-based administration interface listens on 5280 port.
You need a user inside jabberadmins group to login.

Default access to server ports is set to public on following ports: 5280, 5222, 5223.

The XMPP server can be accessed using BOSH protocol (https://xmpp.org/extensions/xep-0206.html) at URL ``/http-bind``.

Example:

* server FQDN: mail.nethserver.org
* BOSH URL: https://mail.nethserver.org/http-bind
