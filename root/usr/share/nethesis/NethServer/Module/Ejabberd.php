<?php
namespace NethServer\Module;

/*
 * Copyright (C) 2011 Nethesis S.r.l.
 * 
 * This script is part of NethServer.
 * 
 * NethServer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * NethServer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with NethServer.  If not, see <http://www.gnu.org/licenses/>.
 */

use Nethgui\System\PlatformInterface as Validate;

/**
 * Enable or disable ejabberd XMPP server
 *
 * @author Giacomo Sanchietti<giacomo.sanchietti@nethesis.it>
 */
class Ejabberd extends \Nethgui\Controller\AbstractController
{

    protected function initializeAttributes(\Nethgui\Module\ModuleAttributesInterface $base)
    {
        return \Nethgui\Module\SimpleModuleAttributesProvider::extendModuleAttributes($base, 'Configuration', 30);
    }

    public function initialize()
    {
        parent::initialize();
        $this->declareParameter('status', Validate::SERVICESTATUS, array('configuration', 'ejabberd', 'status'));
        $this->declareParameter('WebAdmin', Validate::SERVICESTATUS, array('configuration', 'ejabberd', 'WebAdmin'));
        $this->declareParameter('S2S', Validate::SERVICESTATUS, array('configuration', 'ejabberd', 'S2S'));
        $this->declareParameter('ShaperFast', Validate::POSITIVE_INTEGER, array('configuration', 'ejabberd', 'ShaperFast'));
        $this->declareParameter('ShaperNormal', Validate::POSITIVE_INTEGER, array('configuration', 'ejabberd', 'ShaperNormal'));
        $this->declareParameter('ModMamPurgeDBStatus', Validate::SERVICESTATUS, array('configuration', 'ejabberd', 'ModMamPurgeDBStatus'));
        $this->declareParameter('ModMamStatus', Validate::SERVICESTATUS, array('configuration', 'ejabberd', 'ModMamStatus'));
        $this->declareParameter('ModMamPurgeDBInterval', Validate::POSITIVE_INTEGER, array('configuration', 'ejabberd', 'ModMamPurgeDBInterval'));
    }

    public function validate(\Nethgui\Controller\ValidationReportInterface $report)
    {
        if ( ! $this->getRequest()->isMutation()) {
            return;
        }
        elseif  ($this->parameters['ShaperFast'] <= $this->parameters['ShaperNormal']) {
            $report->addValidationErrorMessage($this, 'ShaperFast', 'ShaperFastMustBeSuperiorThanshaperNormal');
        }
        parent::validate($report);
    }

    protected function onParametersSaved($changes)
    {
        $this->getPlatform()->signalEvent('nethserver-ejabberd-save &');
    }

}
