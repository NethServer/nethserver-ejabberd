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
 * Enable or disable ejabberd chat server
 *
 * @author Giacomo Sanchietti<giacomo.sanchietti@nethesis.it>
 */
class Ejabber extends \Nethgui\Controller\AbstractController
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
        $this->declareParameter('shaperFast', Validate::POSITIVE_INTEGER, array('configuration', 'ejabberd', 'shaperFast'));
        $this->declareParameter('shaperNormal', Validate::POSITIVE_INTEGER, array('configuration', 'ejabberd', 'shaperNormal'));
    }

    public function validate(\Nethgui\Controller\ValidationReportInterface $report)
    {
        if ( ! $this->getRequest()->isMutation()) {
            return;
        }
        elseif  ($this->parameters['shaperFast'] <= $this->parameters['shaperNormal']) {
            $report->addValidationErrorMessage($this, 'shaperFast', 'shaperFastMustBeSuperiorThanshaperNormal');
        }
        parent::validate($report);
    }

    protected function onParametersSaved($changes)
    {
        $this->getPlatform()->signalEvent('nethserver-ejabberd-save &');
    }

}
