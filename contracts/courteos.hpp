#pragma once

#include "structs.hpp"


class courteos : public eosio::contract {

  public:

    using arbiters_t = eosio::multi_index<N(arbiters_t), arbiter>;
    using agreements_t = eosio::multi_index<N(agreements_t), agreement>;
    using suits_t = eosio::multi_index<N(suits_t), suit>;


    courteos(account_name self);

    // Open agreement attached to courteos
    /// @abi action
    void openattached(
        account_name initiator,
        account_name partner,
        const std::vector<account_name>& arbiters,
        const std::string& file,
        const std::string& signed_data,
        const signature& signature
    );

    // Open agreement created on courteos
    /// @abi action
    void opencreated(
        account_name initiator,
        account_name partner,
        const std::vector<account_name>& arbiters,
        const std::string& subject,
        uint64_t value,
        uint32_t life_time,
        uint64_t fee,
        const std::string& signed_data,
        const signature& signature
    );

    // Accepts agreement by partner
    /// @abi action
    void accept(
        account_name partner,
        uint64_t agreement_id,
        const std::string& signed_data,
        const signature& signature
    );

    // Make decision on suit by one of participating arbiters
    /// @abi action
    void judge(
        account_name arbiter,
        uint64_t agreement_id,
        uint64_t decision
    );

    // Get all suits related to specified account
    std::vector<suit> getsuits(account_name account);

    // Get suit by it's ID
    suit getsuit(uint64_t suit_id);

    // Get agreement by it's ID
    agreement getagreement(uint64_t agreement_id);

private:

    arbiters_t arbiters;
    agreements_t agreements;
    suits_t suits;
};
