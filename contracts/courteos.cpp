#include "courteos.hpp"

#include <eosiolib/crypto.h>

using namespace eosio;


courteos::courteos(account_name self)
    : contract(self)
    , arbiters(self, N(courteos.code))
    , agreements(self, N(courteos.code))
    , suits(self, N(courteos.code))
{
}

void courteos::openattached(
    account_name initiator,
    account_name partner,
    const std::vector<account_name>& arbiters,
    const std::string& file,
    const std::string& signed_data,
    const signature& signature
) {
    require_auth(initiator);
    require_recipient(partner);
    eosio_assert(arbiters.size() > 0, "list of arbitors cannot be empty");
    eosio_assert(file.length() > 0, "file cannot be empty");
    eosio_assert(signed_data.length() > 0, "signed data cannot be empty");

    agreements.emplace(_self, [&](auto& a) {
        a.id = agreements.available_primary_key();
        a.initiator = initiator;
        a.partner = partner;
        a.arbiters = arbiters;
        a.type = AgreementType::ATTACHED;
        a.state = AgreementState::PENDING;
        a.signed_data = signed_data;
        memcpy(a.initiator_sign.data, signature.data, sizeof(signature));
        a.initiator_sign = signature;
        a.file = file;
        a.decisions.resize(arbiters.size());
        for (auto i = 0; i < a.decisions.size(); ++i) {
            a.decisions[i] = std::numeric_limits<uint64_t>::max();
        }
    });
}

void courteos::opencreated(
    account_name initiator,
    account_name partner,
    const std::vector<account_name>& arbiters,
    const std::string& subject,
    uint64_t value,
    uint32_t life_time,
    uint64_t fee,
    const std::string& signed_data,
    const signature& signature
) {
    require_auth(initiator);
    require_recipient(partner);
    eosio_assert(arbiters.size() > 0, "list of arbitors cannot be empty");
    eosio_assert(subject.length() > 0, "subject matter cannot be empty");
    eosio_assert(life_time > 0, "agreement life time cannot be zero");
    eosio_assert(signed_data.length() > 0, "signed data cannot be empty");

    auto suit = suits.emplace(_self, [&](auto& s) {
        s.id = suits.available_primary_key();
        s.client = initiator;
        s.executor = partner;
        s.subject = subject;
        s.value = value;
        s.life_time = life_time;
        s.fee = fee;
    });

    agreements.emplace(_self, [&](auto& a) {
        a.id = agreements.available_primary_key();
        a.initiator = initiator;
        a.partner = partner;
        a.arbiters = arbiters;
        a.type = AgreementType::CREATED;
        a.state = AgreementState::PENDING;
        a.signed_data = signed_data;
        memcpy(a.initiator_sign.data, signature.data, sizeof(signature));
        a.suit_id = suit->id;
        a.decisions.resize(arbiters.size());
        for (auto i = 0; i < a.decisions.size(); ++i) {
            a.decisions[i] = std::numeric_limits<uint64_t>::max();
        }
    });
}

void courteos::accept(
    account_name partner,
    uint64_t agreement_id,
    const std::string& signed_data,
    const signature& signature
) {
    require_auth(partner);
    eosio_assert(signed_data.size() > 0, "signed data cannot be empty");
    auto agreement = agreements.find(agreement_id);
    eosio_assert(agreement != agreements.end(), "agreement cannot be found");
    eosio_assert(agreement->partner == partner, "unable to accept from by someone except partner");
    eosio_assert(agreement->signed_data.length() == signed_data.length(), "signed data is not valid");
    eosio_assert(memcmp(agreement->signed_data.c_str(), signed_data.c_str(), signed_data.length()) == 0, "signed data is not valid");
    agreements.modify(agreement, _self, [&](auto& a) {
        memcpy(a.partner_sign.data, signature.data, sizeof(signature));
        a.state = AgreementState::SIGNED;
    });
}

void courteos::judge(
    account_name arbiter,
    uint64_t agreement_id,
    uint64_t decision
) {
    require_auth(arbiter);
    eosio_assert(decision <= 1000000, "decision should be in range from 0 to 1000000");
    auto agreement = agreements.find(agreement_id);
    eosio_assert(agreement != agreements.end(), "agreement is not found");
    eosio_assert(agreement->state == AgreementState::DISPUTED, "agreement should be disputed to judge");
    agreements.modify(agreement, _self, [&](auto& a) {
        for (auto i = 0; i < a.decisions.size(); ++i) {
            if (a.arbiters[i] == arbiter) {
                a.decisions[i] = decision;
                break;
            }
        }
    });
    bool consensus = true;
    uint64_t result = std::numeric_limits<uint64_t>::max();
    for (auto i = 0; i < agreement->decisions.size(); ++i) {
        if (agreement->decisions[i] == std::numeric_limits<uint64_t>::max()) {
            consensus = false;
            break;
        } else if (result == std::numeric_limits<uint64_t>::max()) {
            result = agreement->decisions[i];
        } else if (result != agreement->decisions[i]) {
            consensus = false;
            break;
        }
    }
    if (consensus) {
        // TODO: Move stakes and fees
        agreements.modify(agreement, _self, [&](auto& a) {
            a.state = AgreementState::RESOLVED;
        });
    }
}

std::vector<suit> courteos::getsuits(account_name account) {
    std::vector<suit> result;
    for (auto suit = suits.begin(); suit != suits.end(); ++suit) {
        if (suit->client == account || suit->executor == account) {
            result.push_back(*suit);
        }
    }
    return result;
}

suit courteos::getsuit(uint64_t suit_id) {
    auto suit = suits.find(suit_id);
    eosio_assert(suit != suits.end(), "suit is not found");
    return *suit;
}

agreement courteos::getagreement(uint64_t agreement_id) {
    auto agreement = agreements.find(agreement_id);
    eosio_assert(agreement != agreements.end(), "agreement is not found");
    return *agreement;
}

EOSIO_ABI(courteos, (openattached)(opencreated)(accept)(judge))
