# nethserver-ejabberd

NethServer configuration of ejabberd XMPP server

## read

### Input

Available query sections

- `configuration`
- `status`

The input query format is:

```json
{
    "section": ["status", "configuration"]
}
```

It is possible to omit a section, typically `status` which is slower.

### Output

The output contains the queried sections. Possible keys are:

- `configuration`
- `status`

```json
{
  "configuration": {
    "props": {
      "S2S": "enabled",
      "status": "disabled",
      "access": "green,red",
      "ShaperNormal": "500000",
      "WebAdmin": "enabled",
      "ModMamPurgeDBStatus": "enabled",
      "ModMamPurgeDBInterval": "45",
      "TCPPorts": "5222,5223,5269,5280",
      "ShaperFast": "1000000",
      "ModMamStatus": "enabled"
    },
    "name": "ejabberd",
    "type": "service"
  },
  "status": {
    "registered": 0,
    "online": 0,
    "uptime": 0,
    "s2sin": 0,
    "s2sout": 0
  }
}
```

## validate

### Constraints

- Datatypes must be consistent (see the `validate` code)
- `ShaperFast` must be greater than `ShaperNormal`

### Input

The input format is similar to the `read` output: only a subset of "props" is
required.

```json
{
  "configuration": {
    "props": {
      "status": "disabled",
      "WebAdmin": "enabled",
      "S2S": "enabled",
      "ModMamStatus": "enabled",
      "ModMamPurgeDBStatus": "enabled",
      "ModMamPurgeDBInterval": "45",
      "ShaperFast": "1000000",
      "ShaperNormal": "500000"
    }
  }
}
```

Invocation example:
```bash
echo '{"configuration":{"props":{"status":"disabled","WebAdmin":"enabled","S2S":"enabled","ModMamStatus":"enabled","ModMamPurgeDBStatus":"enabled","ModMamPurgeDBInterval":"45","ShaperFast":"1000000","ShaperNormal":"500000"}}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-ejabberd/validate | jq
```

## update

See the `validate` input example: the format is the same.



